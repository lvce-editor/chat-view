import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExecuteToolOptions } from '../Types/Types.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as ChatToolRequest from '../ChatToolRequest/ChatToolRequest.ts'
import { isPathTraversalAttempt } from '../IsPathTraversalAttempt/IsPathTraversalAttempt.ts'
import { normalizeRelativePath } from '../NormalizeRelativePath/NormalizeRelativePath.ts'
import { stringifyToolOutput } from '../StringifyToolOutput/StringifyToolOutput.ts'
import { isToolEnabled } from '../ToolEnablement/ToolEnablement.ts'

const hasWriteFileLineCounts = (value: object): boolean => {
  const linesAdded = Reflect.get(value, 'linesAdded')
  const linesDeleted = Reflect.get(value, 'linesDeleted')
  return typeof linesAdded === 'number' || typeof linesDeleted === 'number'
}

const hasToolError = (value: object): boolean => {
  const error = Reflect.get(value, 'error')
  return typeof error === 'string' && error.trim().length > 0
}

const getStoredToolExecutionStatus = (result: string): 'error' | 'success' => {
  let parsed: unknown
  try {
    parsed = JSON.parse(result) as unknown
  } catch {
    return 'error'
  }
  if (!parsed || typeof parsed !== 'object') {
    return 'error'
  }
  return hasToolError(parsed) ? 'error' : 'success'
}

const parseWriteFileArguments = (rawArguments: unknown): { readonly content: string; readonly target: string } | undefined => {
  let parsed: unknown = rawArguments
  if (typeof rawArguments === 'string') {
    try {
      parsed = JSON.parse(rawArguments) as unknown
    } catch {
      return undefined
    }
  }
  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }
  const content = Reflect.get(parsed, 'content')
  if (typeof content !== 'string') {
    return undefined
  }
  const uri = Reflect.get(parsed, 'uri')
  if (typeof uri === 'string' && uri) {
    return { content, target: uri }
  }
  const path = Reflect.get(parsed, 'path')
  if (typeof path !== 'string' || !path || isPathTraversalAttempt(path)) {
    return undefined
  }
  return {
    content,
    target: normalizeRelativePath(path),
  }
}

const readFileIfExists = async (target: string): Promise<string | undefined> => {
  try {
    return await RendererWorker.readFile(target)
  } catch (error) {
    const message = String(error)
    if (message.includes('ENOENT') || message.includes('No such file') || message.includes('not found')) {
      return undefined
    }
    throw error
  }
}

const toLines = (value: string): readonly string[] => {
  if (!value) {
    return []
  }
  const normalized = value.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
  const lines = normalized.split('\n')
  if (lines.at(-1) === '') {
    lines.pop()
  }
  return lines
}

const getWriteFileLineCounts = (before: string | undefined, after: string): { readonly linesAdded: number; readonly linesDeleted: number } => {
  if (before === after) {
    return {
      linesAdded: 0,
      linesDeleted: 0,
    }
  }
  const beforeLines = toLines(before ?? '')
  const afterLines = toLines(after)
  const dp = Array.from<number>({ length: afterLines.length + 1 }).fill(0)
  for (const beforeLine of beforeLines) {
    let previousDiagonal = 0
    for (let index = 1; index <= afterLines.length; index++) {
      const current = dp[index]
      if (beforeLine === afterLines[index - 1]) {
        dp[index] = previousDiagonal + 1
      } else {
        dp[index] = Math.max(dp[index], dp[index - 1])
      }
      previousDiagonal = current
    }
  }
  const sharedLineCount = dp[afterLines.length]
  return {
    linesAdded: afterLines.length - sharedLineCount,
    linesDeleted: beforeLines.length - sharedLineCount,
  }
}

const withWriteFileLineCounts = async (workerOutput: unknown, rawArguments: unknown): Promise<unknown> => {
  if (!workerOutput || typeof workerOutput !== 'object' || hasWriteFileLineCounts(workerOutput) || hasToolError(workerOutput)) {
    return workerOutput
  }
  const parsedArguments = parseWriteFileArguments(rawArguments)
  if (!parsedArguments) {
    return workerOutput
  }
  const previousContent = await readFileIfExists(parsedArguments.target)
  return {
    ...workerOutput,
    ...getWriteFileLineCounts(previousContent, parsedArguments.content),
  }
}

export const executeChatTool = async (name: string, rawArguments: unknown, options: ExecuteToolOptions): Promise<string> => {
  if (!isToolEnabled(options.toolEnablement, name)) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error(`Tool "${name}" is disabled in chat.toolEnablement preferences.`)
  }
  if (!options.useChatToolWorker) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error('Chat tools must be executed in a web worker environment. Please set useChatToolWorker to true in the options.')
  }
  const executionOptions = {
    assetDir: options.assetDir,
    platform: options.platform,
    ...(options.workspaceUri
      ? {
          workspaceUri: options.workspaceUri,
        }
      : {}),
  }
  const executionId = options.toolCallId || `${name}-${Date.now()}`
  const startedAt = new Date().toISOString()
  if (options.sessionId) {
    await appendChatViewEvent({
      arguments: rawArguments,
      id: executionId,
      name,
      options: executionOptions,
      sessionId: options.sessionId,
      time: startedAt,
      timestamp: startedAt,
      type: 'tool-execution-started',
    })
  }
  try {
    const workerOutput = await ChatToolRequest.execute(name, rawArguments, executionOptions)
    const outputWithLineCounts = name === 'write_file' ? await withWriteFileLineCounts(workerOutput, rawArguments) : workerOutput
    const result = stringifyToolOutput(outputWithLineCounts)
    if (options.sessionId) {
      await appendChatViewEvent({
        id: executionId,
        name,
        result,
        sessionId: options.sessionId,
        status: getStoredToolExecutionStatus(result),
        timestamp: new Date().toISOString(),
        type: 'tool-execution-finished',
      })
    }
    return result
  } catch (error) {
    if (options.sessionId) {
      await appendChatViewEvent({
        id: executionId,
        name,
        result: stringifyToolOutput({
          error: error instanceof Error ? error.message : String(error),
        }),
        sessionId: options.sessionId,
        status: 'error',
        timestamp: new Date().toISOString(),
        type: 'tool-execution-finished',
      })
    }
    throw error
  }
}

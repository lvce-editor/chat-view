import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExecuteToolOptions } from '../Types/Types.ts'
import { getToolErrorPayload } from '../GetToolErrorPayload/GetToolErrorPayload.ts'
import { isPathTraversalAttempt } from '../IsPathTraversalAttempt/IsPathTraversalAttempt.ts'
import { normalizeRelativePath } from '../NormalizeRelativePath/NormalizeRelativePath.ts'

const toLines = (value: string): readonly string[] => {
  if (!value) {
    return []
  }
  const split = value.split('\n').map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line))
  if (split.length > 0 && split[split.length - 1] === '') {
    split.pop()
  }
  return split
}

const getLineCounts = (before: string, after: string): { readonly linesAdded: number; readonly linesDeleted: number } => {
  const beforeLines = toLines(before)
  const afterLines = toLines(after)
  let start = 0
  while (start < beforeLines.length && start < afterLines.length && beforeLines[start] === afterLines[start]) {
    start++
  }
  let beforeEnd = beforeLines.length - 1
  let afterEnd = afterLines.length - 1
  while (beforeEnd >= start && afterEnd >= start && beforeLines[beforeEnd] === afterLines[afterEnd]) {
    beforeEnd--
    afterEnd--
  }
  return {
    linesAdded: Math.max(0, afterEnd - start + 1),
    linesDeleted: Math.max(0, beforeEnd - start + 1),
  }
}

const isFileNotFoundError = (error: unknown): boolean => {
  const message = String(error).toLowerCase()
  return message.includes('enoent') || message.includes('not found')
}

export const executeWriteFileTool = async (args: Readonly<Record<string, unknown>>, _options: ExecuteToolOptions): Promise<string> => {
  const filePath = typeof args.path === 'string' ? args.path : ''
  const content = typeof args.content === 'string' ? args.content : ''
  if (!filePath || isPathTraversalAttempt(filePath)) {
    return JSON.stringify({ error: 'Access denied: path must be relative and stay within the open workspace folder.' })
  }
  const normalizedPath = normalizeRelativePath(filePath)
  try {
    let previousContent = ''
    try {
      previousContent = await RendererWorker.readFile(normalizedPath)
    } catch (error) {
      if (!isFileNotFoundError(error)) {
        throw error
      }
    }
    await RendererWorker.writeFile(normalizedPath, content)
    const { linesAdded, linesDeleted } = getLineCounts(previousContent, content)
    return JSON.stringify({ linesAdded, linesDeleted, ok: true, path: normalizedPath })
  } catch (error) {
    return JSON.stringify({ ...getToolErrorPayload(error), path: normalizedPath })
  }
}

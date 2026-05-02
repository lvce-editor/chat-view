/* eslint-disable prefer-destructuring */
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { GetAiResponseOptions } from '../GetAiResponseOptions/GetAiResponseOptions.ts'
import type { ResponseFunctionCall } from '../ResponseFunctionCall/ResponseFunctionCall.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { defaultAgentMode } from '../AgentMode/AgentMode.ts'
import * as ChatCoordinatorRequest from '../ChatCoordinatorRequest/ChatCoordinatorRequest.ts'
import {
  backendAccessTokenRequiredMessage,
  backendUrlRequiredMessage,
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
} from '../ChatStrings/ChatStrings.ts'
import { executeChatTool, getBasicChatTools } from '../ChatTools/ChatTools.ts'
import { defaultMaxToolCalls } from '../DefaultMaxToolCalls/DefaultMaxToolCalls.ts'
import { getBackendErrorMessage } from '../GetBackendErrorMessage/GetBackendErrorMessage.ts'
import { getChatMessageOpenAiContent } from '../GetChatMessageOpenAiContent/GetChatMessageOpenAiContent.ts'
import { getClientRequestIdHeader } from '../GetClientRequestIdHeader/GetClientRequestIdHeader.ts'
import { getMockAiResponse } from '../GetMockAiResponse/GetMockAiResponse.ts'
import { getMockOpenApiAssistantText } from '../GetMockOpenApiAssistantText/GetMockOpenApiAssistantText.ts'
import { getMockOpenRouterAssistantText } from '../GetMockOpenRouterAssistantText/GetMockOpenRouterAssistantText.ts'
import { getOpenApiApiEndpoint } from '../GetOpenApiApiEndpoint/GetOpenApiApiEndpoint.ts'
import { getOpenApiAssistantText } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getOpenAiParams } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getToolCallExecutionStatus } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getToolCallResult } from '../GetOpenApiAssistantText/GetOpenApiAssistantText.ts'
import { getImageNotSupportedMessage, getOpenApiErrorMessage } from '../GetOpenApiErrorMessage/GetOpenApiErrorMessage.ts'
import { getOpenApiModelId } from '../GetOpenApiModelId/GetOpenApiModelId.ts'
import { getOpenRouterAssistantText } from '../GetOpenRouterAssistantText/GetOpenRouterAssistantText.ts'
import { getOpenRouterErrorMessage } from '../GetOpenRouterErrorMessage/GetOpenRouterErrorMessage.ts'
import { getOpenRouterModelId } from '../GetOpenRouterModelId/GetOpenRouterModelId.ts'
import { isOpenApiModel } from '../IsOpenApiModel/IsOpenApiModel.ts'
import { isOpenRouterModel } from '../IsOpenRouterModel/IsOpenRouterModel.ts'
import * as MockBackendCompletion from '../MockBackendCompletion/MockBackendCompletion.ts'
import * as MockOpenApiRequest from '../MockOpenApiRequest/MockOpenApiRequest.ts'

const trailingSlashesRegex = /\/+$/

const shouldUseBackendResponses = (backendUrl: string, authAccessToken: string): boolean => {
  return !!backendUrl && !!authAccessToken
}

const getBackendResponsesEndpoint = (backendUrl: string): string => {
  const trimmedBackendUrl = backendUrl.replace(trailingSlashesRegex, '')
  return `${trimmedBackendUrl}/v1/responses`
}

const hasImageAttachments = (messages: readonly ChatMessage[]): boolean => {
  return messages.some((message) => message.attachments?.some((attachment) => attachment.displayType === 'image'))
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object'
}

const getBackendErrorMessageFromBody = (body: unknown): string | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const directMessage = Reflect.get(body, 'message')
  if (typeof directMessage === 'string' && directMessage) {
    return directMessage
  }
  const directError = Reflect.get(body, 'error')
  if (typeof directError === 'string' && directError) {
    return directError
  }
  if (!isObject(directError)) {
    return undefined
  }
  const nestedMessage = Reflect.get(directError, 'message')
  if (typeof nestedMessage === 'string' && nestedMessage) {
    return nestedMessage
  }
  return undefined
}

const getBackendErrorCodeFromBody = (body: unknown): string | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const directCode = Reflect.get(body, 'code')
  if (typeof directCode === 'string' && directCode) {
    return directCode
  }
  const directError = Reflect.get(body, 'error')
  if (!isObject(directError)) {
    return undefined
  }
  const nestedCode = Reflect.get(directError, 'code')
  if (typeof nestedCode === 'string' && nestedCode) {
    return nestedCode
  }
  return undefined
}

const getBackendStatusCodeFromBody = (body: unknown): number | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const statusCode = Reflect.get(body, 'statusCode')
  if (typeof statusCode === 'number') {
    return statusCode
  }
  return undefined
}

const getBackendResponseId = (body: unknown): string | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const id = Reflect.get(body, 'id')
  return typeof id === 'string' && id ? id : undefined
}

const getBackendResponseStatus = (body: unknown): string | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const status = Reflect.get(body, 'status')
  return typeof status === 'string' && status ? status : undefined
}

const getBackendIncompleteMessage = (body: unknown): string | undefined => {
  if (!isObject(body)) {
    return undefined
  }
  const incompleteDetails = Reflect.get(body, 'incomplete_details')
  if (!isObject(incompleteDetails)) {
    return undefined
  }
  const reason = Reflect.get(incompleteDetails, 'reason')
  if (typeof reason === 'string' && reason) {
    return `Backend response was incomplete (${reason}).`
  }
  return undefined
}

const getBackendResponseFunctionCalls = (body: unknown): readonly ResponseFunctionCall[] => {
  if (!isObject(body)) {
    return []
  }
  const output = Reflect.get(body, 'output')
  if (!Array.isArray(output)) {
    return []
  }
  const calls: ResponseFunctionCall[] = []
  for (const outputItem of output) {
    if (!isObject(outputItem)) {
      continue
    }
    if (Reflect.get(outputItem, 'type') !== 'function_call') {
      continue
    }
    const callId = Reflect.get(outputItem, 'call_id')
    const name = Reflect.get(outputItem, 'name')
    const rawArguments = Reflect.get(outputItem, 'arguments')
    if (typeof callId !== 'string' || !callId || typeof name !== 'string' || !name) {
      continue
    }
    calls.push({
      arguments: typeof rawArguments === 'string' ? rawArguments : '',
      callId,
      name,
    })
  }
  return calls
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (error instanceof Error) {
    return error.message
  }
  return typeof error === 'string' && error ? error : undefined
}

const getBackendInvalidResponseDetails = (body: unknown): string => {
  const errorMessage = getBackendErrorMessageFromBody(body)
  if (errorMessage) {
    return errorMessage
  }
  const incompleteMessage = getBackendIncompleteMessage(body)
  if (incompleteMessage) {
    return incompleteMessage
  }
  const status = getBackendResponseStatus(body)
  if (status && status !== 'completed') {
    return `Backend response status was "${status}".`
  }
  if (isObject(body) && Array.isArray(Reflect.get(body, 'output'))) {
    return 'Unexpected backend response format: no assistant text or tool calls were returned.'
  }
  return 'Unexpected backend response format.'
}

const toExecutedToolCall = (toolCall: ResponseFunctionCall, content: string): StreamingToolCall => {
  const executionStatus = getToolCallExecutionStatus(content)
  const toolCallResult = getToolCallResult(toolCall.name, content)
  return {
    arguments: toolCall.arguments,
    ...(executionStatus.errorMessage
      ? {
          errorMessage: executionStatus.errorMessage,
        }
      : {}),
    ...(executionStatus.errorStack
      ? {
          errorStack: executionStatus.errorStack,
        }
      : {}),
    id: toolCall.callId,
    name: toolCall.name,
    ...(toolCallResult
      ? {
          result: toolCallResult,
        }
      : {}),
    ...(executionStatus.status
      ? {
          status: executionStatus.status,
        }
      : {}),
  }
}

const getBackendResponseOutputText = (body: unknown): string => {
  if (!isObject(body)) {
    return ''
  }
  const outputText = Reflect.get(body, 'output_text')
  if (typeof outputText === 'string' && outputText) {
    return outputText
  }
  const text = Reflect.get(body, 'text')
  if (typeof text === 'string' && text) {
    return text
  }
  const message = Reflect.get(body, 'message')
  if (isObject(message)) {
    const content = Reflect.get(message, 'content')
    if (typeof content === 'string' && content) {
      return content
    }
  }
  const choices = Reflect.get(body, 'choices')
  if (Array.isArray(choices)) {
    const firstChoice = choices[0]
    if (isObject(firstChoice)) {
      const firstMessage = Reflect.get(firstChoice, 'message')
      if (isObject(firstMessage)) {
        const content = Reflect.get(firstMessage, 'content')
        if (typeof content === 'string' && content) {
          return content
        }
      }
    }
  }
  const output = Reflect.get(body, 'output')
  if (!Array.isArray(output)) {
    return ''
  }
  const chunks: string[] = []
  for (const outputItem of output) {
    if (!isObject(outputItem)) {
      continue
    }
    if (Reflect.get(outputItem, 'type') !== 'message') {
      continue
    }
    const content = Reflect.get(outputItem, 'content')
    if (!Array.isArray(content)) {
      continue
    }
    for (const part of content) {
      if (!isObject(part)) {
        continue
      }
      const type = Reflect.get(part, 'type')
      const text = Reflect.get(part, 'text')
      if ((type === 'output_text' || type === 'text') && typeof text === 'string' && text) {
        chunks.push(text)
      }
    }
  }
  return chunks.join('')
}

const getBackendResponsesBody = (
  input: readonly unknown[],
  modelId: string,
  systemPrompt: string,
  tools: readonly unknown[],
  maxToolCalls: number,
  webSearchEnabled: boolean,
  previousResponseId?: string,
  reasoningEffort?: GetAiResponseOptions['reasoningEffort'],
  supportsReasoningEffort = false,
): object => {
  return getOpenAiParams(
    input,
    modelId,
    false,
    false,
    tools,
    webSearchEnabled,
    maxToolCalls,
    systemPrompt,
    previousResponseId,
    reasoningEffort,
    supportsReasoningEffort,
  )
}

interface GetBackendAssistantTextOptions {
  readonly agentMode?: GetAiResponseOptions['agentMode']
  readonly assetDir: string
  readonly authAccessToken: string
  readonly backendUrl: string
  readonly maxToolCalls?: number
  readonly messages: readonly ChatMessage[]
  readonly modelId: string
  readonly onToolCallsChunk?: GetAiResponseOptions['onToolCallsChunk']
  readonly platform: GetAiResponseOptions['platform']
  readonly questionToolEnabled?: boolean
  readonly reasoningEffort?: GetAiResponseOptions['reasoningEffort']
  readonly sessionId?: string
  readonly supportsReasoningEffort?: boolean
  readonly systemPrompt: string
  readonly toolEnablement?: GetAiResponseOptions['toolEnablement']
  readonly useChatToolWorker: boolean
  readonly webSearchEnabled?: boolean
  readonly workspaceUri?: string
}

const getBackendAssistantText = async ({
  agentMode = defaultAgentMode,
  assetDir,
  authAccessToken,
  backendUrl,
  maxToolCalls = defaultMaxToolCalls,
  messages,
  modelId,
  onToolCallsChunk,
  platform,
  questionToolEnabled = false,
  reasoningEffort,
  sessionId,
  supportsReasoningEffort = false,
  systemPrompt,
  toolEnablement,
  useChatToolWorker,
  webSearchEnabled = false,
  workspaceUri,
}: GetBackendAssistantTextOptions): Promise<string> => {
  const mockError = MockBackendCompletion.takeErrorResponse()
  if (mockError) {
    const errorCode = getBackendErrorCodeFromBody(mockError.body)
    const errorMessage = getBackendErrorMessageFromBody(mockError.body)
    return getBackendErrorMessage({
      details: 'http-error',
      ...(errorCode
        ? {
            errorCode,
          }
        : {}),
      ...(typeof mockError.statusCode === 'number'
        ? {
            statusCode: mockError.statusCode,
          }
        : {}),
      ...(errorMessage
        ? {
            errorMessage,
          }
        : {}),
    })
  }
  const mockResponse = MockBackendCompletion.takeResponse()

  const tools = await getBasicChatTools(agentMode, questionToolEnabled, toolEnablement)
  const input: unknown[] = messages.map((message) => ({
    content: getChatMessageOpenAiContent(message),
    role: message.role,
  }))
  let previousResponseId: string | undefined
  const maxToolIterations = Math.max(0, maxToolCalls - 1)

  for (let index = 0; index <= maxToolIterations; index++) {
    let json: unknown
    if (index === 0 && mockResponse) {
      json = mockResponse.body
    } else {
      let response: Response
      try {
        response = await fetch(getBackendResponsesEndpoint(backendUrl), {
          body: JSON.stringify(
            getBackendResponsesBody(
              input,
              modelId,
              systemPrompt,
              tools,
              maxToolCalls,
              webSearchEnabled,
              previousResponseId,
              reasoningEffort,
              supportsReasoningEffort,
            ),
          ),
          headers: {
            Authorization: `Bearer ${authAccessToken}`,
            'Content-Type': 'application/json',
            ...getClientRequestIdHeader(),
          },
          method: 'POST',
        })
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        return getBackendErrorMessage({
          details: 'request-failed',
          ...(errorMessage
            ? {
                errorMessage,
              }
            : {}),
        })
      }
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => undefined)
        const errorCode = getBackendErrorCodeFromBody(payload)
        const errorMessage = getBackendErrorMessageFromBody(payload)
        const statusCode = response.status || getBackendStatusCodeFromBody(payload)
        return getBackendErrorMessage({
          details: 'http-error',
          ...(errorCode
            ? {
                errorCode,
              }
            : {}),
          ...(typeof statusCode === 'number'
            ? {
                statusCode,
              }
            : {}),
          ...(errorMessage
            ? {
                errorMessage,
              }
            : {}),
        })
      }
      try {
        json = (await response.json()) as unknown
      } catch {
        return getBackendErrorMessage({
          details: 'invalid-response',
          errorMessage: 'Backend returned invalid JSON.',
        })
      }
    }

    const responseFunctionCalls = getBackendResponseFunctionCalls(json)
    if (responseFunctionCalls.length > 0) {
      const responseId = getBackendResponseId(json)
      if (!responseId) {
        return getBackendErrorMessage({
          details: 'invalid-response',
          errorMessage: 'Unexpected backend response format: tool calls were returned without a response id.',
        })
      }
      previousResponseId = responseId
      input.length = 0
      const executedToolCalls: StreamingToolCall[] = []
      for (const toolCall of responseFunctionCalls) {
        const content = await executeChatTool(toolCall.name, toolCall.arguments, {
          assetDir,
          platform,
          ...(sessionId
            ? {
                sessionId,
              }
            : {}),
          toolCallId: toolCall.callId,
          ...(toolEnablement
            ? {
                toolEnablement,
              }
            : {}),
          useChatToolWorker,
          ...(workspaceUri
            ? {
                workspaceUri,
              }
            : {}),
        })
        executedToolCalls.push(toExecutedToolCall(toolCall, content))
        input.push({
          call_id: toolCall.callId,
          output: content,
          type: 'function_call_output',
        })
      }
      if (onToolCallsChunk && executedToolCalls.length > 0) {
        await onToolCallsChunk(executedToolCalls)
      }
      continue
    }

    const content = getBackendResponseOutputText(json)
    if (content) {
      return content
    }

    return getBackendErrorMessage({
      details: 'invalid-response',
      errorMessage: getBackendInvalidResponseDetails(json),
    })
  }

  return getBackendErrorMessage({
    details: 'invalid-response',
    errorMessage: `Backend request ended after ${maxToolCalls} tool-call rounds without a final assistant response. This usually means the model got stuck in a tool loop.`,
  })
}

export const getAiResponse = async ({
  agentMode = defaultAgentMode,
  assetDir,
  authAccessToken,
  backendUrl = '',
  maxToolCalls = defaultMaxToolCalls,
  messageId,
  messages,
  mockAiResponseDelay = 800,
  mockApiCommandId,
  models,
  nextMessageId,
  onDataEvent,
  onEventStreamFinished,
  onMockOpenApiRequestCaptured,
  onTextChunk,
  onToolCallsChunk,
  openApiApiBaseUrl,
  openApiApiKey,
  openRouterApiBaseUrl,
  openRouterApiKey,
  passIncludeObfuscation = false,
  platform,
  questionToolEnabled = false,
  reasoningEffort,
  selectedModelId,
  sessionId,
  streamingEnabled = true,
  systemPrompt = '',
  toolEnablement,
  useChatCoordinatorWorker = false,
  useChatNetworkWorkerForRequests = false,
  useChatToolWorker = true,
  useMockApi,
  useOwnBackend = false,
  userText,
  webSearchEnabled = false,
  workspaceUri,
}: GetAiResponseOptions): Promise<ChatMessage> => {
  useChatCoordinatorWorker = false // TODO enable this
  const authToken = authAccessToken || ''
  const backendEnabled = shouldUseBackendResponses(backendUrl, authToken)
  if (useChatCoordinatorWorker && !backendEnabled) {
    try {
      const result = await ChatCoordinatorRequest.getAiResponse({
        agentMode,
        assetDir,
        ...(messageId
          ? {
              messageId,
            }
          : {}),
        maxToolCalls,
        messages,
        mockAiResponseDelay,
        mockApiCommandId,
        models,
        nextMessageId,
        openApiApiBaseUrl,
        openApiApiKey,
        openRouterApiBaseUrl,
        openRouterApiKey,
        passIncludeObfuscation,
        platform,
        questionToolEnabled,
        ...(reasoningEffort
          ? {
              reasoningEffort,
            }
          : {}),
        selectedModelId,
        streamingEnabled,
        systemPrompt,
        ...(toolEnablement
          ? {
              toolEnablement,
            }
          : {}),
        useChatNetworkWorkerForRequests,
        useChatToolWorker,
        useMockApi,
        userText,
        webSearchEnabled: agentMode === 'plan' ? false : webSearchEnabled,
        ...(workspaceUri
          ? {
              workspaceUri,
            }
          : {}),
      })
      if (streamingEnabled) {
        if (onTextChunk) {
          await onTextChunk(result.text)
        }
        if (onEventStreamFinished) {
          await onEventStreamFinished()
        }
      }
      return result
    } catch {
      // Fall back to the local implementation if coordinator worker RPC is unavailable.
    }
  }

  let text = ''
  const usesOpenApiModel = isOpenApiModel(selectedModelId, models)
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  const selectedModel = models.find((model) => model.id === selectedModelId)
  const supportsImages = selectedModel?.supportsImages ?? false
  const supportsReasoningEffort = selectedModel?.supportsReasoningEffort ?? false
  const safeMaxToolCalls = Math.max(1, maxToolCalls)
  if (hasImageAttachments(messages) && !supportsImages) {
    text = getImageNotSupportedMessage(selectedModel?.name)
  }
  if (!text && (backendEnabled || useOwnBackend)) {
    if (!backendUrl) {
      text = backendUrlRequiredMessage
    } else if (authToken) {
      text = await getBackendAssistantText({
        agentMode,
        assetDir,
        authAccessToken: authToken,
        backendUrl,
        maxToolCalls: safeMaxToolCalls,
        messages,
        modelId: getOpenApiModelId(selectedModelId),
        onToolCallsChunk,
        platform,
        questionToolEnabled,
        reasoningEffort,
        supportsReasoningEffort,
        systemPrompt,
        toolEnablement,
        useChatToolWorker,
        webSearchEnabled: agentMode === 'plan' ? false : webSearchEnabled,
        ...(sessionId
          ? {
              sessionId,
            }
          : {}),
        ...(workspaceUri
          ? {
              workspaceUri,
            }
          : {}),
      })
    } else {
      text = backendAccessTokenRequiredMessage
    }
  }
  if (!text && usesOpenApiModel) {
    if (useMockApi) {
      const openAiInput: any[] = messages.map((message) => ({
        content: getChatMessageOpenAiContent(message),
        role: message.role,
      }))
      const modelId = getOpenApiModelId(selectedModelId)
      const headers = {
        Authorization: `Bearer ${openApiApiKey}`,
        'Content-Type': 'application/json',
        ...getClientRequestIdHeader(),
      }
      const maxToolIterations = safeMaxToolCalls - 1
      let previousResponseId: string | undefined
      for (let i = 0; i <= maxToolIterations; i++) {
        const tools1 = await getBasicChatTools(agentMode, questionToolEnabled, toolEnablement)
        const request = {
          headers,
          method: 'POST',
          payload: getOpenAiParams(
            openAiInput,
            modelId,
            streamingEnabled,
            passIncludeObfuscation,
            tools1,
            agentMode === 'plan' ? false : webSearchEnabled,
            safeMaxToolCalls,
            systemPrompt,
            previousResponseId,
            reasoningEffort,
            supportsReasoningEffort,
          ),
          url: getOpenApiApiEndpoint(openApiApiBaseUrl),
        }
        MockOpenApiRequest.capture(request)
        if (onMockOpenApiRequestCaptured) {
          await Promise.resolve(onMockOpenApiRequestCaptured(request))
        }
        const result = await getMockOpenApiAssistantText(streamingEnabled, onTextChunk, onToolCallsChunk, onDataEvent, onEventStreamFinished)
        if (result.type !== 'success') {
          text = getOpenApiErrorMessage(result)
          break
        }
        text = result.text
        if (result.responseId) {
          previousResponseId = result.responseId
        }
        if (result.responseFunctionCalls.length === 0) {
          break
        }
        openAiInput.length = 0
        const executedToolCalls: StreamingToolCall[] = []
        for (const toolCall of result.responseFunctionCalls) {
          const content = await executeChatTool(toolCall.name, toolCall.arguments, {
            assetDir,
            platform,
            ...(sessionId
              ? {
                  sessionId,
                }
              : {}),
            toolCallId: toolCall.callId,
            ...(toolEnablement
              ? {
                  toolEnablement,
                }
              : {}),
            useChatToolWorker,
            ...(workspaceUri
              ? {
                  workspaceUri,
                }
              : {}),
          })
          const executionStatus = getToolCallExecutionStatus(content)
          const toolCallResult = getToolCallResult(toolCall.name, content)
          executedToolCalls.push({
            arguments: toolCall.arguments,
            ...(executionStatus.errorStack
              ? {
                  errorStack: executionStatus.errorStack,
                }
              : {}),
            ...(executionStatus.errorMessage
              ? {
                  errorMessage: executionStatus.errorMessage,
                }
              : {}),
            id: toolCall.callId,
            name: toolCall.name,
            ...(toolCallResult
              ? {
                  result: toolCallResult,
                }
              : {}),
            ...(executionStatus.status
              ? {
                  status: executionStatus.status,
                }
              : {}),
          })
          openAiInput.push({
            call_id: toolCall.callId,
            output: content,
            type: 'function_call_output',
          })
        }
        if (onToolCallsChunk && executedToolCalls.length > 0) {
          await onToolCallsChunk(executedToolCalls)
        }
      }
    } else if (openApiApiKey) {
      const result = await getOpenApiAssistantText(
        messages,
        getOpenApiModelId(selectedModelId),
        openApiApiKey,
        openApiApiBaseUrl,
        assetDir,
        platform,
        {
          agentMode,
          includeObfuscation: passIncludeObfuscation,
          maxToolCalls: safeMaxToolCalls,
          ...(onDataEvent
            ? {
                onDataEvent,
              }
            : {}),
          ...(onEventStreamFinished
            ? {
                onEventStreamFinished,
              }
            : {}),
          ...(onTextChunk
            ? {
                onTextChunk,
              }
            : {}),
          ...(onToolCallsChunk
            ? {
                onToolCallsChunk,
              }
            : {}),
          questionToolEnabled,
          ...(reasoningEffort
            ? {
                reasoningEffort,
              }
            : {}),
          ...(sessionId
            ? {
                sessionId,
              }
            : {}),
          stream: streamingEnabled,
          supportsReasoningEffort,
          systemPrompt,
          ...(toolEnablement
            ? {
                toolEnablement,
              }
            : {}),
          useChatNetworkWorkerForRequests,
          useChatToolWorker,
          webSearchEnabled: agentMode === 'plan' ? false : webSearchEnabled,
          ...(workspaceUri
            ? {
                workspaceUri,
              }
            : {}),
        },
      )
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenApiErrorMessage(result)
      }
    } else {
      text = openApiApiKeyRequiredMessage
    }
  } else if (!text && usesOpenRouterModel) {
    const modelId = getOpenRouterModelId(selectedModelId)
    if (useMockApi) {
      const result = await getMockOpenRouterAssistantText(
        messages,
        modelId,
        openRouterApiBaseUrl,
        openRouterApiKey,
        mockApiCommandId,
        assetDir,
        platform,
      )
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenRouterErrorMessage(result)
      }
    } else if (openRouterApiKey) {
      const result = await getOpenRouterAssistantText(
        messages,
        modelId,
        openRouterApiKey,
        openRouterApiBaseUrl,
        assetDir,
        platform,
        useChatNetworkWorkerForRequests,
        useChatToolWorker,
        questionToolEnabled,
        systemPrompt,
        workspaceUri,
        agentMode,
        toolEnablement,
        sessionId,
      )
      if (result.type === 'success') {
        const { text: assistantText } = result
        text = assistantText
      } else {
        text = getOpenRouterErrorMessage(result)
      }
    } else {
      text = openRouterApiKeyRequiredMessage
    }
  }
  if (!text && !usesOpenApiModel && !usesOpenRouterModel) {
    text = await getMockAiResponse(userText, mockAiResponseDelay)
  }
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const message: ChatMessage = {
    id: messageId || crypto.randomUUID(),
    role: 'assistant',
    text,
    time: assistantTime,
  }
  return message
}

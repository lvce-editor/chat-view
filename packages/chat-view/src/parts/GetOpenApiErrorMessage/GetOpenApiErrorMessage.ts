/* cspell:ignore sonarjs */

import type { GetOpenApiAssistantTextErrorResult } from '../GetOpenApiAssistantTextErrorResult/GetOpenApiAssistantTextErrorResult.ts'
import { openApiRequestFailedMessage, openApiRequestFailedOfflineMessage } from '../ChatStrings/ChatStrings.ts'
import { defaultMaxToolCalls } from '../DefaultMaxToolCalls/DefaultMaxToolCalls.ts'

const imageRegex = /\b(?:image|vision|multimodal)\b/i
const unsupportedRegex = /\bdoes(?:\s+not|n't)\s+support|not\s+support(?:ed)?|unsupported\b/i

const isOffline = (): boolean => {
  if (!globalThis.navigator) {
    return false
  }
  return globalThis.navigator.onLine === false
}

export const isImageNotSupportedError = (
  errorResult: Pick<GetOpenApiAssistantTextErrorResult, 'errorCode' | 'errorMessage' | 'errorType'>,
): boolean => {
  const haystack = [errorResult.errorCode, errorResult.errorMessage, errorResult.errorType].filter(Boolean).join(' ')
  return imageRegex.test(haystack) && unsupportedRegex.test(haystack)
}

export const getImageNotSupportedMessage = (modelName?: string): string => {
  const subject = modelName ? `${modelName} does not support image attachments.` : 'This model does not support image attachments.'
  return `${subject} Choose a vision-capable model like GPT-4o Mini or GPT-4o, or remove the image and try again.`
}

export const getOpenApiErrorMessage = (errorResult: GetOpenApiAssistantTextErrorResult): string => {
  switch (errorResult.details) {
    case 'http-error': {
      const errorMessage = errorResult.errorMessage?.trim()
      const hasErrorCode = typeof errorResult.errorCode === 'string' && errorResult.errorCode.length > 0
      const hasErrorType = typeof errorResult.errorType === 'string' && errorResult.errorType.length > 0

      // Provide a concise, user-friendly message when OpenAI reports an invalid API key.
      if (errorResult.errorCode === 'invalid_api_key') {
        const status = typeof errorResult.statusCode === 'number' ? errorResult.statusCode : 401
        return `OpenAI request failed (Status ${status}): Invalid API key. Please verify your OpenAI API key in Chat Settings.`
      }

      if (isImageNotSupportedError(errorResult)) {
        return getImageNotSupportedMessage()
      }

      if (errorResult.statusCode === 429) {
        let prefix = 'OpenAI rate limit exceeded (429)'
        if (hasErrorCode) {
          prefix = `OpenAI rate limit exceeded (429: ${errorResult.errorCode})`
        }
        if (hasErrorType) {
          prefix += ` [${errorResult.errorType}]`
        }
        prefix += '.'
        if (!errorMessage) {
          return prefix
        }
        return `${prefix} ${errorMessage}`
      }

      if (typeof errorResult.statusCode === 'number') {
        let prefix = `OpenAI request failed (status ${errorResult.statusCode})`
        if (hasErrorCode) {
          prefix += `: ${errorResult.errorCode}`
        }
        if (hasErrorType) {
          prefix += ` [${errorResult.errorType}]`
        }
        prefix += '.'
        if (!errorMessage) {
          return prefix
        }
        return `${prefix} ${errorMessage}`
      }

      if (errorMessage) {
        return `OpenAI request failed. ${errorMessage}`
      }
      return openApiRequestFailedMessage
    }
    case 'request-failed':
      if (errorResult.isOffline || isOffline()) {
        return openApiRequestFailedOfflineMessage
      }
      return openApiRequestFailedMessage
    case 'tool-iterations-exhausted': {
      const rounds = typeof errorResult.iterationLimit === 'number' ? errorResult.iterationLimit : defaultMaxToolCalls
      return `OpenAI request ended after ${rounds} tool-call rounds without a final assistant response. This usually means the model got stuck in a tool loop. Please try rephrasing your request, reducing scope, or switching to a different model.`
    }
  }
}

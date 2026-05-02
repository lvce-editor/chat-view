import { backendCompletionFailedMessage } from '../ChatStrings/ChatStrings.ts'

interface BackendHttpErrorResult {
  readonly details: 'http-error'
  readonly errorCode?: string
  readonly errorMessage?: string
  readonly statusCode?: number
}

interface BackendRequestFailedErrorResult {
  readonly details: 'request-failed'
  readonly errorMessage?: string
}

interface BackendInvalidResponseErrorResult {
  readonly details: 'invalid-response'
  readonly errorMessage?: string
}

export type GetBackendErrorMessageResult = BackendHttpErrorResult | BackendRequestFailedErrorResult | BackendInvalidResponseErrorResult

const getBackendHttpErrorDetails = (errorCode: string | undefined, errorMessage: string | undefined): string | undefined => {
  const trimmedErrorCode = errorCode?.trim()
  const trimmedErrorMessage = errorMessage?.trim()
  if (trimmedErrorCode && trimmedErrorMessage) {
    return `Error code: ${trimmedErrorCode}. ${trimmedErrorMessage}`
  }
  if (trimmedErrorCode) {
    return `Error code: ${trimmedErrorCode}.`
  }
  return trimmedErrorMessage
}

export const getBackendErrorMessage = (errorResult: GetBackendErrorMessageResult): string => {
  switch (errorResult.details) {
    case 'http-error': {
      const details = getBackendHttpErrorDetails(errorResult.errorCode, errorResult.errorMessage)
      if (typeof errorResult.statusCode === 'number') {
        const prefix = `Backend completion request failed (status ${errorResult.statusCode}).`
        if (!details) {
          return prefix
        }
        return `${prefix} ${details}`
      }
      if (details) {
        return `Backend completion request failed. ${details}`
      }
      return backendCompletionFailedMessage
    }
    case 'invalid-response': {
      const errorMessage = errorResult.errorMessage?.trim()
      if (errorMessage) {
        return `Backend completion request failed. ${errorMessage}`
      }
      return 'Backend completion request failed. Unexpected backend response format.'
    }
    case 'request-failed': {
      const errorMessage = errorResult.errorMessage?.trim()
      if (errorMessage) {
        return `Backend completion request failed. ${errorMessage}`
      }
      return backendCompletionFailedMessage
    }
  }
}

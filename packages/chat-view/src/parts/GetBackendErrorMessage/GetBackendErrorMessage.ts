import { backendCompletionFailedMessage } from '../ChatStrings/ChatStrings.ts'

interface BackendHttpErrorResult {
  readonly details: 'http-error'
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

export const getBackendErrorMessage = (errorResult: GetBackendErrorMessageResult): string => {
  switch (errorResult.details) {
    case 'http-error': {
      const errorMessage = errorResult.errorMessage?.trim()
      if (typeof errorResult.statusCode === 'number') {
        const prefix = `Backend completion request failed (status ${errorResult.statusCode}).`
        if (!errorMessage) {
          return prefix
        }
        return `${prefix} ${errorMessage}`
      }
      if (errorMessage) {
        return `Backend completion request failed. ${errorMessage}`
      }
      return backendCompletionFailedMessage
    }
    case 'request-failed': {
      const errorMessage = errorResult.errorMessage?.trim()
      if (errorMessage) {
        return `Backend completion request failed. ${errorMessage}`
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
  }
}

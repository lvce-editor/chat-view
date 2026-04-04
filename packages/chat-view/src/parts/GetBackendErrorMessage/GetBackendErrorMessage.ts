import { backendCompletionFailedMessage } from '../ChatStrings/ChatStrings.ts'

interface BackendHttpErrorResult {
  readonly details: 'http-error'
  readonly errorMessage?: string
  readonly statusCode?: number
}

interface BackendRequestFailedErrorResult {
  readonly details: 'request-failed'
}

export type GetBackendErrorMessageResult = BackendHttpErrorResult | BackendRequestFailedErrorResult

export const getBackendErrorMessage = (errorResult: GetBackendErrorMessageResult): string => {
  switch (errorResult.details) {
    case 'request-failed':
      return backendCompletionFailedMessage
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
  }
}

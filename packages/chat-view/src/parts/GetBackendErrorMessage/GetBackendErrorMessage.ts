import { backendCompletionFailedMessage } from '../ChatStrings/ChatStrings.ts'

interface BackendHttpErrorResult {
  readonly details: 'http-error'
  readonly errorCode?: string
  readonly errorMessage?: string
  readonly statusCode?: number
}

interface BackendRequestFailedErrorResult {
  readonly details: 'request-failed'
  readonly errorCode?: string
  readonly errorMessage?: string
}

interface BackendInvalidResponseErrorResult {
  readonly details: 'invalid-response'
  readonly errorMessage?: string
}

export type GetBackendErrorMessageResult = BackendHttpErrorResult | BackendRequestFailedErrorResult | BackendInvalidResponseErrorResult

const getHttpErrorPrefix = (statusCode?: number, errorCode?: string): string => {
  const normalizedErrorCode = errorCode?.trim()
  if (typeof statusCode === 'number') {
    if (normalizedErrorCode) {
      return `Backend completion request failed (status ${statusCode}: ${normalizedErrorCode}).`
    }
    return `Backend completion request failed (status ${statusCode}).`
  }
  if (normalizedErrorCode) {
    return `Backend completion request failed (${normalizedErrorCode}).`
  }
  return 'Backend completion request failed.'
}

const getRequestFailedDetails = (errorMessage?: string): string => {
  const normalizedErrorMessage = errorMessage?.trim()
  if (!normalizedErrorMessage) {
    return 'Unable to reach the backend. Please check that the backend is running, reachable from the browser, and allows this origin.'
  }
  if (/failed to fetch|fetch failed/i.test(normalizedErrorMessage)) {
    return `${normalizedErrorMessage}. Please check that the backend is running, reachable from the browser, and allows this origin.`
  }
  return normalizedErrorMessage
}

export const getBackendErrorMessage = (errorResult: GetBackendErrorMessageResult): string => {
  switch (errorResult.details) {
    case 'http-error': {
      const prefix = getHttpErrorPrefix(errorResult.statusCode, errorResult.errorCode)
      const errorMessage = errorResult.errorMessage?.trim()
      if (errorMessage) {
        return `${prefix} ${errorMessage}`
      }
      return prefix === 'Backend completion request failed.' ? backendCompletionFailedMessage : prefix
    }
    case 'invalid-response': {
      const errorMessage = errorResult.errorMessage?.trim()
      if (errorMessage) {
        return `Backend completion request failed. ${errorMessage}`
      }
      return 'Backend completion request failed. Unexpected backend response format.'
    }
    case 'request-failed': {
      const prefix = getHttpErrorPrefix(undefined, errorResult.errorCode || 'network_error')
      return `${prefix} ${getRequestFailedDetails(errorResult.errorMessage)}`
    }
  }
}

interface MockBackendCompletionHttpErrorResponse {
  readonly body: unknown
  readonly statusCode: number
  readonly type: 'http-error'
}

interface MockBackendCompletionRequestFailedResponse {
  readonly errorCode?: string
  readonly errorMessage?: string
  readonly type: 'request-failed'
}

interface MockBackendCompletionSuccessResponse {
  readonly body: unknown
  readonly type: 'success'
}

let errorResponse: MockBackendCompletionHttpErrorResponse | undefined
let requestFailedResponse: MockBackendCompletionRequestFailedResponse | undefined
let successResponse: MockBackendCompletionSuccessResponse | undefined

export const setHttpErrorResponse = (statusCode: number, body: unknown): void => {
  errorResponse = {
    body,
    statusCode,
    type: 'http-error',
  }
}

export const setResponse = (body: unknown): void => {
  successResponse = {
    body,
    type: 'success',
  }
}

export const setRequestFailedResponse = (errorMessage?: string, errorCode: string = 'network_error'): void => {
  requestFailedResponse = {
    ...(errorCode
      ? {
          errorCode,
        }
      : {}),
    ...(errorMessage
      ? {
          errorMessage,
        }
      : {}),
    type: 'request-failed',
  }
}

export const takeErrorResponse = (): MockBackendCompletionHttpErrorResponse | undefined => {
  const response = errorResponse
  errorResponse = undefined
  return response
}

export const takeRequestFailedResponse = (): MockBackendCompletionRequestFailedResponse | undefined => {
  const response = requestFailedResponse
  requestFailedResponse = undefined
  return response
}

export const takeResponse = (): MockBackendCompletionSuccessResponse | undefined => {
  const response = successResponse
  successResponse = undefined
  return response
}

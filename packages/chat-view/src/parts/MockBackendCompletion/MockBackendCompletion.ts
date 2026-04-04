interface MockBackendCompletionHttpErrorResponse {
  readonly body: unknown
  readonly statusCode: number
  readonly type: 'http-error'
}

let errorResponse: MockBackendCompletionHttpErrorResponse | undefined

export const setHttpErrorResponse = (statusCode: number, body: unknown): void => {
  errorResponse = {
    body,
    statusCode,
    type: 'http-error',
  }
}

export const takeErrorResponse = (): MockBackendCompletionHttpErrorResponse | undefined => {
  const response = errorResponse
  errorResponse = undefined
  return response
}

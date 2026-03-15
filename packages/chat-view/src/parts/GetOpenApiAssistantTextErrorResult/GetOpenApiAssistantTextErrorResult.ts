export interface GetOpenApiAssistantTextErrorResult {
  readonly details: 'request-failed' | 'http-error'
  readonly errorCode?: string
  readonly errorMessage?: string
  readonly errorType?: string
  readonly isOffline?: boolean
  readonly statusCode?: number
  readonly type: 'error'
}

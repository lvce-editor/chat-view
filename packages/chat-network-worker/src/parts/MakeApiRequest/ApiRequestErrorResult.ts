export interface ApiRequestErrorResult {
  readonly headers: Record<string, string>
  readonly response: string
  readonly statusCode: number
  readonly type: 'error'
}
export interface ApiRequestSuccessResult {
  readonly body: unknown
  readonly headers: Record<string, string>
  readonly statusCode: number
  readonly type: 'success'
}
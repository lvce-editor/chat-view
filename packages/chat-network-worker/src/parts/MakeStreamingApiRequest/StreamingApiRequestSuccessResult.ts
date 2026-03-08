export interface StreamingApiRequestSuccessResult {
  readonly body: readonly unknown[]
  readonly headers: Record<string, string>
  readonly statusCode: number
  readonly type: 'success'
}

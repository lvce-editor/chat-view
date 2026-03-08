export interface MakeApiRequestOptions {
  readonly headers?: Record<string, string>
  readonly method: string
  readonly postBody?: unknown
  readonly url: string
}

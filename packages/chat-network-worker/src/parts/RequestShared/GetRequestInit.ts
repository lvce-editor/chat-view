import type { MakeApiRequestOptions } from './MakeApiRequestOptions.ts'

export const getRequestInit = (options: Readonly<MakeApiRequestOptions>): RequestInit => {
  return {
    body: options.postBody === undefined ? undefined : JSON.stringify(options.postBody),
    headers: options.headers,
    method: options.method,
  }
}
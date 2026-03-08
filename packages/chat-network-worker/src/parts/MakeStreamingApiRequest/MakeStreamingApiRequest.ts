import type { MakeApiRequestOptions } from '../RequestShared/MakeApiRequestOptions.ts'
import type { StreamingApiRequestResult } from './StreamingApiRequestResult.ts'
import { getFetchThrownErrorResult } from '../RequestShared/GetFetchThrownErrorResult.ts'
import { getHeadersObject } from '../RequestShared/GetHeadersObject.ts'
import { getRequestInit } from '../RequestShared/GetRequestInit.ts'
import { parseSseFromReader } from './ParseSseFromReader.ts'

export const makeStreamingApiRequest = async (options: Readonly<MakeApiRequestOptions>): Promise<StreamingApiRequestResult> => {
  let response: Response
  try {
    response = await fetch(options.url, getRequestInit(options))
  } catch (error) {
    return getFetchThrownErrorResult(error)
  }

  const headers = getHeadersObject(response.headers)
  if (!response.ok) {
    const responseText = await response.text()
    return {
      headers,
      response: responseText,
      statusCode: response.status,
      type: 'error',
    }
  }

  const body = await parseSseFromReader(response.body)
  return {
    body,
    headers,
    statusCode: response.status,
    type: 'success',
  }
}

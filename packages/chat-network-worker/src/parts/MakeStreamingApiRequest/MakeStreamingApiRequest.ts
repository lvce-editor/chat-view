import { getHeadersObject } from '../RequestShared/GetHeadersObject.ts'
import { getFetchThrownErrorResult } from '../RequestShared/GetFetchThrownErrorResult.ts'
import { getRequestInit } from '../RequestShared/GetRequestInit.ts'
import type { MakeApiRequestOptions } from '../RequestShared/MakeApiRequestOptions.ts'
import { parseSseFromReader } from './ParseSseFromReader.ts'
import type { StreamingApiRequestResult } from './StreamingApiRequestResult.ts'

export const makeStreamingApiRequest = async (
  options: Readonly<MakeApiRequestOptions>,
): Promise<StreamingApiRequestResult> => {
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

  const body = await parseSseFromReader(response)
  return {
    body,
    headers,
    statusCode: response.status,
    type: 'success',
  }
}
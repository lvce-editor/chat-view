import { getHeadersObject } from '../RequestShared/GetHeadersObject.ts'
import { getFetchThrownErrorResult } from '../RequestShared/GetFetchThrownErrorResult.ts'
import { getRequestInit } from '../RequestShared/GetRequestInit.ts'
import type { MakeApiRequestOptions } from '../RequestShared/MakeApiRequestOptions.ts'
import type { ApiRequestResult } from './ApiRequestResult.ts'
import { parseResponseJson } from './ParseResponseJson.ts'

export const makeApiRequest = async (options: Readonly<MakeApiRequestOptions>): Promise<ApiRequestResult> => {
  let response: Response
  try {
    response = await fetch(options.url, getRequestInit(options))
  } catch (error) {
    return getFetchThrownErrorResult(error)
  }

  const headers = getHeadersObject(response.headers)
  const responseText = await response.text()

  if (!response.ok) {
    return {
      headers,
      response: responseText,
      statusCode: response.status,
      type: 'error',
    }
  }

  let parsed: unknown
  try {
    parsed = parseResponseJson(responseText)
  } catch {
    return {
      headers,
      response: responseText,
      statusCode: response.status,
      type: 'error',
    }
  }

  return {
    body: parsed,
    headers,
    statusCode: response.status,
    type: 'success',
  }
}
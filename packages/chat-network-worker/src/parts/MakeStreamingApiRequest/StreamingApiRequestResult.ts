import type { ApiRequestErrorResult } from '../MakeApiRequest/MakeApiRequest.ts'
import type { StreamingApiRequestSuccessResult } from './StreamingApiRequestSuccessResult.ts'

export type StreamingApiRequestResult = StreamingApiRequestSuccessResult | ApiRequestErrorResult

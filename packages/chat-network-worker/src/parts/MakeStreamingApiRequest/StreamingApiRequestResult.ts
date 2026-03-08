import type { ApiRequestErrorResult } from '../MakeApiRequest/ApiRequestErrorResult.ts'
import type { StreamingApiRequestSuccessResult } from './StreamingApiRequestSuccessResult.ts'

export type StreamingApiRequestResult = StreamingApiRequestSuccessResult | ApiRequestErrorResult
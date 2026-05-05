import type { PrototypeState } from '../PrototypeState/PrototypeState.ts'
import * as MockBackendAuth from '../MockBackendAuth/MockBackendAuth.ts'

interface MockBackendAuthResponsePayload {
  readonly accessToken?: string
  readonly delay?: number
  readonly errorName?: string
  readonly message?: string
  readonly refreshToken?: string
  readonly request?: 'login' | 'refresh'
  readonly subscriptionPlan?: string
  readonly type?: 'error' | 'success'
  readonly usedTokens?: number
  readonly userName?: string
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object'
}

const getDelay = (payload: unknown): number => {
  if (!isObject(payload)) {
    return 0
  }
  const { delay } = payload
  return typeof delay === 'number' && delay > 0 ? delay : 0
}

export const mockBackendAuthResponse = (
  state: PrototypeState,
  payload: MockBackendAuthResponsePayload,
): PrototypeState => {
  const delay = getDelay(payload)
  if (payload.type === 'error') {
    MockBackendAuth.setNextRefreshResponse({
      delay,
      ...(payload.errorName ? { errorName: payload.errorName } : {}),
      message: payload.message || 'Backend authentication failed.',
      type: 'error',
    })
    return state
  }
  MockBackendAuth.setNextRefreshResponse({
    delay,
    response: payload,
    type: 'success',
  })
  return state
}
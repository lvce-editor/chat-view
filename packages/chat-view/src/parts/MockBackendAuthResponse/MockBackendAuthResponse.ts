import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockBackendAuth from '../MockBackendAuth/MockBackendAuth.ts'

interface MockBackendAuthResponsePayload {
  readonly accessToken?: string
  readonly delay?: number
  readonly message?: string
  readonly request?: 'login' | 'refresh'
  readonly refreshToken?: string
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

export const mockBackendAuthResponse = (state: ChatState, payload: MockBackendAuthResponsePayload): ChatState => {
  const delay = getDelay(payload)
  const setNextResponse = payload.request === 'refresh' ? MockBackendAuth.setNextRefreshResponse : MockBackendAuth.setNextLoginResponse
  if (payload.type === 'error') {
    setNextResponse({
      delay,
      message: payload.message || 'Backend authentication failed.',
      type: 'error',
    })
    return state
  }
  setNextResponse({
    delay,
    response: payload,
    type: 'success',
  })
  return state
}

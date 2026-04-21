interface MockBackendAuthSuccess {
  readonly delay: number
  readonly response: unknown
  readonly type: 'success'
}

interface MockBackendAuthError {
  readonly delay: number
  readonly message: string
  readonly type: 'error'
}

type MockBackendAuthResponse = MockBackendAuthSuccess | MockBackendAuthError

let nextRefreshResponse: MockBackendAuthResponse | undefined

export const setNextRefreshResponse = (response: MockBackendAuthResponse): void => {
  nextRefreshResponse = response
}

export const clear = (): void => {
  nextRefreshResponse = undefined
}

export const hasPendingMockRefreshResponse = (): boolean => {
  return !!nextRefreshResponse
}

export const consumeNextRefreshResponse = async (): Promise<unknown> => {
  if (!nextRefreshResponse) {
    return undefined
  }
  const response = nextRefreshResponse
  nextRefreshResponse = undefined
  if (response.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, response.delay))
  }
  if (response.type === 'error') {
    throw new Error(response.message)
  }
  return response.response
}
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

let nextLoginResponse: MockBackendAuthResponse | undefined
let nextRefreshResponse: MockBackendAuthResponse | undefined

const createAbortError = (): Error => {
  return Object.assign(new Error('The operation was aborted.'), {
    name: 'AbortError',
  })
}

const waitForDelay = async (delay: number, signal?: AbortSignal): Promise<void> => {
  if (delay <= 0) {
    return
  }
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, delay)
    const handleAbort = () => {
      clearTimeout(timeout)
      reject(createAbortError())
    }
    if (signal?.aborted) {
      handleAbort()
      return
    }
    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

const consumeResponse = async (response: MockBackendAuthResponse | undefined, signal?: AbortSignal): Promise<unknown> => {
  if (!response) {
    return undefined
  }
  await waitForDelay(response.delay, signal)
  if (response.type === 'error') {
    throw new Error(response.message)
  }
  return response.response
}

export const setNextLoginResponse = (response: MockBackendAuthResponse): void => {
  nextLoginResponse = response
}

export const setNextRefreshResponse = (response: MockBackendAuthResponse): void => {
  nextRefreshResponse = response
}

export const clear = (): void => {
  nextLoginResponse = undefined
  nextRefreshResponse = undefined
}

export const hasPendingMockLoginResponse = (): boolean => {
  return !!nextLoginResponse
}

export const hasPendingMockRefreshResponse = (): boolean => {
  return !!nextRefreshResponse
}

export const consumeNextLoginResponse = async (): Promise<unknown> => {
  const response = nextLoginResponse
  nextLoginResponse = undefined
  return consumeResponse(response)
}

export const consumeNextRefreshResponse = async (signal?: AbortSignal): Promise<unknown> => {
  const response = nextRefreshResponse
  nextRefreshResponse = undefined
  return consumeResponse(response, signal)
}

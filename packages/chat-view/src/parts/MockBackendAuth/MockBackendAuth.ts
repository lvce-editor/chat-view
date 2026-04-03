interface MockBackendAuthSuccess {
  readonly delay: number
  readonly response: unknown
  readonly type: 'success'
}

interface MockBackendAuthError {
  readonly delay: number
  readonly errorName?: string
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

const createError = (message: string, errorName?: string): Error => {
  if (errorName === 'TypeError') {
    return new TypeError(message)
  }
  const error = new Error(message)
  if (errorName) {
    error.name = errorName
  }
  return error
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
    const handleAbort = (): void => {
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

const consumeResponse = async (response: Readonly<MockBackendAuthResponse> | undefined, signal?: AbortSignal): Promise<unknown> => {
  if (!response) {
    return undefined
  }
  await waitForDelay(response.delay, signal)
  if (response.type === 'error') {
    throw createError(response.message, response.errorName)
  }
  return response.response
}

export const setNextLoginResponse = (response: Readonly<MockBackendAuthResponse>): void => {
  nextLoginResponse = response
}

export const setNextRefreshResponse = (response: Readonly<MockBackendAuthResponse>): void => {
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

export const consumeNextRefreshResponse = async (signal?: Readonly<AbortSignal>): Promise<unknown> => {
  const response = nextRefreshResponse
  nextRefreshResponse = undefined
  return consumeResponse(response, signal)
}

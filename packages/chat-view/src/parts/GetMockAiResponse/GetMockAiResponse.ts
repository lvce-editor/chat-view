const delayWithAbort = async (ms: number, abortSignal?: Readonly<AbortSignal>): Promise<void> => {
  if (abortSignal?.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError')
  }
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve()
    }, ms)
    if (!abortSignal) {
      return
    }
    const abortHandler = (): void => {
      clearTimeout(timeout)
      abortSignal.removeEventListener('abort', abortHandler)
      reject(new DOMException('The operation was aborted.', 'AbortError'))
    }
    abortSignal.addEventListener('abort', abortHandler)
  })
}

export const getMockAiResponse = async (userMessage: string, delayInMs: number, abortSignal?: Readonly<AbortSignal>): Promise<string> => {
  await delayWithAbort(delayInMs, abortSignal)
  return `Mock AI response: I received "${userMessage}".`
}

let queue: string[] = []
let waiters: Array<(chunk: string | undefined) => void> = []
let finished = false

export const reset = (): void => {
  queue = []
  waiters = []
  finished = false
}

export const pushChunk = (chunk: string): void => {
  if (waiters.length > 0) {
    const resolve = waiters.shift()
    resolve?.(chunk)
    return
  }
  queue.push(chunk)
}

export const finish = (): void => {
  finished = true
  if (waiters.length === 0) {
    return
  }
  const activeWaiters = waiters
  waiters = []
  for (const resolve of activeWaiters) {
    resolve(undefined)
  }
}

export const readNextChunk = async (): Promise<string | undefined> => {
  if (queue.length > 0) {
    return queue.shift()
  }
  if (finished) {
    return undefined
  }
  return new Promise((resolve) => {
    waiters.push(resolve)
  })
}

const activeRequests = new Map<number, AbortController>()

export const create = (uid: number): AbortSignal => {
  const previous = activeRequests.get(uid)
  previous?.abort()
  const controller = new AbortController()
  activeRequests.set(uid, controller)
  return controller.signal
}

export const abort = (uid: number): void => {
  const controller = activeRequests.get(uid)
  if (!controller) {
    return
  }
  controller.abort()
  activeRequests.delete(uid)
}

export const clear = (uid: number): void => {
  activeRequests.delete(uid)
}

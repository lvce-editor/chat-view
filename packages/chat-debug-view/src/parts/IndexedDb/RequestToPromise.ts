export const requestToPromise = async <T>(createRequest: () => IDBRequest<T>): Promise<T> => {
  const request = createRequest()
  const { promise, reject, resolve } = Promise.withResolvers<T>()
  request.addEventListener('success', () => {
    resolve(request.result)
  })
  request.addEventListener('error', () => {
    reject(request.error || new Error('IndexedDB request failed'))
  })
  return promise
}

export const requestToPromise = async <T>(createRequest: () => IDBRequest<T>): Promise<T> => {
  const request = createRequest()
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => {
      resolve(request.result)
    })
    request.addEventListener('error', () => {
      reject(request.error || new Error('IndexedDB request failed'))
    })
  })
}

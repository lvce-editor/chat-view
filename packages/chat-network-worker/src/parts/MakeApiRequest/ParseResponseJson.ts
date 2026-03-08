export const parseResponseJson = (responseText: string): unknown => {
  if (!responseText) {
    return null
  }
  return JSON.parse(responseText) as unknown
}

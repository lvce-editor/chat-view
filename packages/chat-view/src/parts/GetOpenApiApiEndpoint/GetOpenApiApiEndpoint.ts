export const getOpenApiApiEndpoint = (openApiApiBaseUrl: string, stream: boolean): string => {
  if (stream) {
    return `${openApiApiBaseUrl}/chat/completions?stream=true`
  }
  return `${openApiApiBaseUrl}/chat/completions`
}

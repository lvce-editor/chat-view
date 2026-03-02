/* eslint-disable @cspell/spellchecker */
export const getOpenApiModelId = (selectedModelId: string): string => {
  const openApiPrefix = 'openapi/'
  if (selectedModelId.toLowerCase().startsWith(openApiPrefix)) {
    return selectedModelId.slice(openApiPrefix.length)
  }
  return selectedModelId
}

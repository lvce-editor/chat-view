export const getOpenRouterModelId = (selectedModelId: string): string => {
  if (selectedModelId.startsWith('openRouter/')) {
    return selectedModelId.slice('openRouter/'.length)
  }
  return selectedModelId
}

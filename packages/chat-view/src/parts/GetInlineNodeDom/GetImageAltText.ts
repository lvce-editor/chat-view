import * as ChatStrings from '../ChatStrings/ChatStrings.ts'

export const getImageAltText = (alt: string): string => {
  if (!alt.trim()) {
    return ChatStrings.imageCouldNotBeLoaded()
  }
  return `${alt} (${ChatStrings.imageCouldNotBeLoaded()})`
}

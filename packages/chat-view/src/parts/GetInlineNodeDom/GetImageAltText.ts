export const getImageAltText = (alt: string): string => {
  if (!alt.trim()) {
    return 'image could not be loaded'
  }
  return `${alt} (image could not be loaded)`
}

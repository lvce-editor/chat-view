export const parseSseData = (text: string): unknown => {
  if (text === '[DONE]') {
    return text
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}
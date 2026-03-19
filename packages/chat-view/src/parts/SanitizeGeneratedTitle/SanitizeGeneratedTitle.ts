const titlePrefixRegex = /^title:\s*/i
const wrappedQuotesAndWhitespaceRegex = /^['"`\s]+|['"`\s]+$/g
const consecutiveWhitespaceRegex = /\s+/g

export const sanitizeGeneratedTitle = (value: string): string => {
  return value
    .replace(titlePrefixRegex, '')
    .replaceAll(wrappedQuotesAndWhitespaceRegex, '')
    .replaceAll(consecutiveWhitespaceRegex, ' ')
    .trim()
    .slice(0, 80)
}

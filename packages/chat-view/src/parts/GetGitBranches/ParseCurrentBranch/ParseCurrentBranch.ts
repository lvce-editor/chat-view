const headRefRegex = /^ref:\s+refs\/heads\/(.+)$/m

export const parseCurrentBranch = (headContent: string): string => {
  const match = headRefRegex.exec(headContent.trim())
  if (match) {
    return match[1].trim()
  }
  return ''
}

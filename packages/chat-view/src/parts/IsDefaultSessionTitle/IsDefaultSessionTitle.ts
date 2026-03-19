const defaultSessionTitleRegex = /^Chat \d+$/

export const isDefaultSessionTitle = (title: string): boolean => {
  return defaultSessionTitleRegex.test(title)
}

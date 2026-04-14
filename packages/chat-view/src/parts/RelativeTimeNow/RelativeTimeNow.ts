let relativeTimeNow: number | undefined

export const getRelativeTimeNow = (): number => {
  return relativeTimeNow ?? Date.now()
}

export const setRelativeTimeNowForTest = (value: number): void => {
  relativeTimeNow = value
}

export const resetRelativeTimeNowForTest = (): void => {
  relativeTimeNow = undefined
}
export const clampToPercentage = (tokensUsed: number, tokensMax: number): number => {
  if (tokensMax <= 0) {
    return 0
  }
  const percentage = (tokensUsed / tokensMax) * 100
  return Math.max(0, Math.min(100, percentage))
}
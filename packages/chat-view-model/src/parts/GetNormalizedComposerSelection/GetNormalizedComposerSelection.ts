const clampSelectionIndex = (value: number, max: number): number => {
  if (!Number.isFinite(value)) {
    return 0
  }
  const integerValue = Math.trunc(value)
  if (integerValue < 0) {
    return 0
  }
  if (integerValue > max) {
    return max
  }
  return integerValue
}

export const getNormalizedComposerSelection = (
  composerValue: string,
  composerSelectionStart: number,
  composerSelectionEnd: number,
): readonly [number, number] => {
  const maxIndex = composerValue.length
  const normalizedStart = clampSelectionIndex(composerSelectionStart, maxIndex)
  const normalizedEnd = clampSelectionIndex(composerSelectionEnd, maxIndex)
  if (normalizedStart <= normalizedEnd) {
    return [normalizedStart, normalizedEnd]
  }
  return [normalizedEnd, normalizedStart]
}

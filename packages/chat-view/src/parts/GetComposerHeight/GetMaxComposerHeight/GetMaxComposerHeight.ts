export const getMaxComposerHeight = (lineHeight: number, maxComposerRows: number): number => {
  return lineHeight * Math.max(1, maxComposerRows) + 8
}

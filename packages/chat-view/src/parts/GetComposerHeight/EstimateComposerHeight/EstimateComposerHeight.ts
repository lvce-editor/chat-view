export const estimateComposerHeight = (value: string, lineHeight: number): number => {
  const lineCount = value.split('\n').length
  return lineCount * lineHeight + 8
}

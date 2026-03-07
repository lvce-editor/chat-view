export const getCss = (composerHeight: number): string => {
  return `:root {
  --ChatInputBoxHeight: ${composerHeight}px;
}`
}

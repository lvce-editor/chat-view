export const getCss = (composerHeight: number, listItemHeight: number): string => {
  return `:root {
  --ChatInputBoxHeight: ${composerHeight}px;
  --ChatListItemHeight: ${listItemHeight}px;
}`
}

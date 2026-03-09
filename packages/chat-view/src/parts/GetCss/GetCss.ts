export const getCss = (
  composerHeight: number,
  listItemHeight: number,
  chatMessageFontSize: number,
  chatMessageLineHeight: number,
  chatMessageFontFamily: string,
): string => {
  return `:root {
  --ChatInputBoxHeight: ${composerHeight}px;
  --ChatListItemHeight: ${listItemHeight}px;
  --ChatMessageFontSize: ${chatMessageFontSize}px;
  --ChatMessageLineHeight: ${chatMessageLineHeight}px;
  --ChatMessageFontFamily: ${chatMessageFontFamily};
}

.ChatToolCalls {
  position: relative;
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 10px 8px 6px;
  background: var(--vscode-editorWidget-background);
}

.ChatToolCallsLabel {
  position: absolute;
  top: -8px;
  left: 8px;
  padding: 0 4px;
  border-radius: 3px;
  background: var(--vscode-editor-background);
  color: var(--vscode-descriptionForeground);
  font-size: 10px;
  line-height: 14px;
  text-transform: lowercase;
  letter-spacing: 0.02em;
}

.ChatToolCallReadFileLink {
  color: var(--vscode-textLink-foreground);
  text-decoration: underline;
}

.ChatMessageLink {
  color: var(--vscode-textLink-foreground);
  text-decoration: underline;
  cursor: pointer;
}`
}

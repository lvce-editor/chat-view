export const getCss = (
  composerHeight: number,
  listItemHeight: number,
  chatMessageFontSize: number,
  chatMessageLineHeight: number,
  chatMessageFontFamily: string,
  renderHtmlCss: string,
): string => {
  const baseCss = `:root {
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

.ChatToolCallRenderHtmlLabel {
  margin-bottom: 6px;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
}

.ChatToolCallRenderHtmlContent {
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 6px;
  background: var(--vscode-editor-background);
  overflow: hidden;
}

.ChatToolCallRenderHtmlBody {
  min-height: 180px;
  padding: 12px;
}

.ChatToolCallRenderHtmlBody * {
  box-sizing: border-box;
}

.ChatMessageLink {
  color: #4d94ff;
  text-decoration: underline;
  cursor: pointer;
}

.ChatOrderedList,
.ChatUnorderedList {
  margin: 6px 0;
  padding-inline-start: 20px;
}

.ChatOrderedListItem,
.ChatUnorderedListItem {
  margin: 2px 0;
}

.MarkdownTable {
  width: 100%;
  margin: 6px 0;
  border-collapse: collapse;
  border: 1px solid var(--vscode-editorWidget-border);
}

.MarkdownTable th,
.MarkdownTable td {
  border: 1px solid var(--vscode-editorWidget-border);
  padding: 4px 8px;
  text-align: left;
}

.MarkdownTable th {
  background: var(--vscode-editorWidget-background);
}

.ChatSendAreaContent {
  position: relative;
}

.ChatSendAreaDropTarget {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: var(--ChatInputBoxHeight);
  border: 1px dashed transparent;
  border-radius: 6px;
  background: transparent;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease-in-out, border-color 120ms ease-in-out, background-color 120ms ease-in-out;
}

.ChatSendAreaDropTargetActive {
  opacity: 1;
  pointer-events: auto;
  border-color: var(--vscode-focusBorder);
  background: color-mix(in srgb, var(--vscode-focusBorder) 10%, transparent);
}
}`

  if (!renderHtmlCss.trim()) {
    return baseCss
  }

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

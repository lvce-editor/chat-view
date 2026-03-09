export const getCss = (): string => {
  return `
.ChatDebugView {
  padding: 8px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  box-sizing: border-box;
  gap: 8px;
}

.ChatDebugViewTop {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ChatDebugViewTop .InputBox {
  flex: 1;
}

.ChatDebugViewToggle {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.ChatDebugViewSession {
  font-size: 12px;
  opacity: 0.8;
}

.ChatDebugViewEventCount {
  font-size: 12px;
  opacity: 0.8;
}

.ChatDebugViewEvents {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--vscode-scrollbarSlider-background, rgba(121, 121, 121, 0.4)) transparent;
}

.ChatDebugViewEvents::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.ChatDebugViewEvents::-webkit-scrollbar-track {
  background: transparent;
}

.ChatDebugViewEvents::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background, rgba(121, 121, 121, 0.4));
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.ChatDebugViewEvents::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground, rgba(100, 100, 100, 0.7));
}

.ChatDebugViewEvents::-webkit-scrollbar-thumb:active {
  background: var(--vscode-scrollbarSlider-activeBackground, rgba(191, 191, 191, 0.4));
}

.ChatDebugViewEvent {
  margin: 0;
  padding: 8px;
  border: 1px solid var(--vscode-editorWidget-border, #454545);
  border-radius: 6px;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--vscode-editor-font-family, monospace);
  font-size: 12px;
  user-select: text;
}

.ChatDebugViewEmpty {
  opacity: 0.8;
}

.ChatDebugViewError {
  color: var(--vscode-errorForeground, #f14c4c);
  white-space: normal;
}

.TokenText {
  color: var(--vscode-editor-foreground, inherit);
}

.TokenKey {
  color: var(--vscode-symbolIcon-propertyForeground, var(--vscode-editor-foreground, inherit));
}

.TokenString {
  color: var(--vscode-debugTokenExpression-string, var(--vscode-charts-green, #89d185));
}

.TokenNumeric {
  color: var(--vscode-debugTokenExpression-number, var(--vscode-charts-blue, #75beff));
}

.TokenBoolean {
  color: var(--vscode-debugTokenExpression-boolean, var(--vscode-charts-yellow, #dcdcaa));
}

.ChatOrderedList{
  margin:0;
}

.ChatOrderedListItem{
  margin:0;
  padding:0;
}
`
}

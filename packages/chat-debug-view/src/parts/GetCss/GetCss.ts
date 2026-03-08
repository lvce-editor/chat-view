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
}

.ChatDebugViewTop .InputBox {
  width: 100%;
}

.ChatDebugViewSession {
  font-size: 12px;
  opacity: 0.8;
}

.ChatDebugViewEvents {
  overflow: auto;
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
}

.ChatDebugViewEmpty {
  opacity: 0.8;
}
`
}

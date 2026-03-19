export const getCss = (
  composerHeight: number,
  listItemHeight: number,
  chatMessageFontSize: number,
  chatMessageLineHeight: number,
  chatMessageFontFamily: string,
  textAreaPaddingTop: number,
  textAreaPaddingLeft: number,
  textAreaPaddingRight: number,
  textAreaPaddingBottom: number,
  chatSendAreaPaddingTop: number,
  chatSendAreaPaddingLeft: number,
  chatSendAreaPaddingRight: number,
  chatSendAreaPaddingBottom: number,
  renderHtmlCss: string,
): string => {
  const buttonsHeight = 20
  const gap = 10
  const contentPadding = 10
  const chatSendAreaHeight = composerHeight + chatSendAreaPaddingTop + chatSendAreaPaddingBottom + buttonsHeight + gap + contentPadding * 2
  const baseCss = `:root {
  --ChatInputBoxHeight: ${composerHeight}px;
  --ChatTextAreaHeight: ${composerHeight}px;
  --ChatSendAreaHeight: ${chatSendAreaHeight}px;
  --ChatTextAreaPaddingTop: ${textAreaPaddingTop}px;
  --ChatTextAreaPaddingLeft: ${textAreaPaddingLeft}px;
  --ChatTextAreaPaddingRight: ${textAreaPaddingRight}px;
  --ChatTextAreaPaddingBottom: ${textAreaPaddingBottom}px;
  --ChatSendAreaPaddingTop: ${chatSendAreaPaddingTop}px;
  --ChatSendAreaPaddingLeft: ${chatSendAreaPaddingLeft}px;
  --ChatSendAreaPaddingRight: ${chatSendAreaPaddingRight}px;
  --ChatSendAreaPaddingBottom: ${chatSendAreaPaddingBottom}px;
  --ChatListItemHeight: ${listItemHeight}px;
  --ChatMessageFontSize: ${chatMessageFontSize}px;
  --ChatMessageLineHeight: ${chatMessageLineHeight}px;
  --ChatMessageFontFamily: ${chatMessageFontFamily};
}

.ChatSendAreaBottom{
  height: ${buttonsHeight}px;
}
<<<<<<< HEAD

.ChatTodoListItems {
  list-style: none;
  margin: 0;
  max-height: 180px;
  overflow: auto;
  padding: 4px 0;
}

.ChatTodoListItem {
  align-items: center;
  color: var(--vscode-foreground);
  display: flex;
  font-size: 12px;
  line-height: 18px;
  min-height: 24px;
  padding: 0 10px;
}

.ChatTodoListItem::before {
  color: var(--vscode-descriptionForeground);
  content: "○";
  display: inline-block;
  margin-right: 8px;
  width: 1em;
}

.ChatTodoListItemTodo::before {
  content: "○";
}

.ChatTodoListItem.todo::before {
  content: "○";
}

.ChatTodoListItemInProgress::before {
  color: var(--vscode-textLink-foreground);
  content: "◐";
}

.ChatTodoListItem.inProgress::before {
  color: var(--vscode-textLink-foreground);
  content: "◐";
}

.ChatTodoListItemCompleted {
  color: var(--vscode-disabledForeground);
}

.ChatTodoListItem.completed {
  color: var(--vscode-disabledForeground);
}

.ChatTodoListItemCompleted::before {
  color: var(--vscode-testing-iconPassed);
  content: "✓";
}

.ChatTodoListItem.completed::before {
  color: var(--vscode-testing-iconPassed);
  content: "✓";
}

.ChatModelPickerContainer {
  position: relative;
}

.ChatModelPicker {
  background: var(--vscode-editorWidget-background);
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 8px;
  bottom: calc(100% + 8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  left: 0;
  min-width: 280px;
  position: absolute;
  z-index: 100;
}

.ChatModelPickerHeader {
  align-items: center;
  border-bottom: 1px solid var(--vscode-editorWidget-border);
  display: flex;
  gap: 8px;
  padding: 8px;
}

.ChatModelPickerHeader .InputBox {
  flex: 1;
}

.ChatModelPickerList {
  max-height: 240px;
  overflow: auto;
  padding: 4px 0;
}

.ChatModelPickerItem {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  display: flex;
  font: inherit;
  height: 28px;
  justify-content: flex-start;
  padding: 0 10px;
  text-align: left;
  width: 100%;
}

.ChatModelPickerItem:hover,
.ChatModelPickerItemSelected {
  background: var(--vscode-list-hoverBackground);
}`
  }

  return `${baseCss}

.ChatTodoList {
  background: var(--vscode-editorWidget-background);
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 6px;
  margin-bottom: 8px;
  overflow: hidden;
}

.ChatTodoListHeader {
  border-bottom: 1px solid var(--vscode-editorWidget-border);
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
  line-height: 18px;
  padding: 6px 10px;
}

.ChatTodoListItems {
  list-style: none;
  margin: 0;
  max-height: 180px;
  overflow: auto;
  padding: 4px 0;
}

.ChatTodoListItem {
  align-items: center;
  color: var(--vscode-foreground);
  display: flex;
  font-size: 12px;
  line-height: 18px;
  min-height: 24px;
  padding: 0 10px;
}

.ChatTodoListItem::before {
  color: var(--vscode-descriptionForeground);
  content: "○";
  display: inline-block;
  margin-right: 8px;
  width: 1em;
}

.ChatTodoListItemTodo::before {
  content: "○";
}

.ChatTodoListItem.todo::before {
  content: "○";
}

.ChatTodoListItemInProgress::before {
  color: var(--vscode-textLink-foreground);
  content: "◐";
}

.ChatTodoListItem.inProgress::before {
  color: var(--vscode-textLink-foreground);
  content: "◐";
}

.ChatTodoListItemCompleted {
  color: var(--vscode-disabledForeground);
}

.ChatTodoListItem.completed {
  color: var(--vscode-disabledForeground);
}

.ChatTodoListItemCompleted::before {
  color: var(--vscode-testing-iconPassed);
  content: "✓";
}

.ChatTodoListItem.completed::before {
  color: var(--vscode-testing-iconPassed);
  content: "✓";
}

.ChatModelPickerContainer {
  position: relative;
}

.ChatModelPicker {
  background: var(--vscode-editorWidget-background);
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 8px;
  bottom: calc(100% + 8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  left: 0;
  min-width: 280px;
  position: absolute;
  z-index: 100;
}

.ChatModelPickerHeader {
  align-items: center;
  border-bottom: 1px solid var(--vscode-editorWidget-border);
  display: flex;
  gap: 8px;
  padding: 8px;
}

.ChatModelPickerHeader .InputBox {
  flex: 1;
}

.ChatModelPickerList {
  max-height: 240px;
  overflow: auto;
  padding: 4px 0;
}

.ChatModelPickerItem {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  display: flex;
  font: inherit;
  height: 28px;
  justify-content: flex-start;
  padding: 0 10px;
  text-align: left;
  width: 100%;
}

.ChatModelPickerItem:hover,
.ChatModelPickerItemSelected {
  background: var(--vscode-list-hoverBackground);
}

=======
`

  return `${baseCss}

>>>>>>> origin/main
/* render_html tool css */
${renderHtmlCss}`
}

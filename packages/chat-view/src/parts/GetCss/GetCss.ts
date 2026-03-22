/* eslint-disable @cspell/spellchecker */
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

.ChatInputBox{
  width: 100%;
  margin: 0;
  border: none;
  outline: none;
  flex: 1;
  background: var(--InputBoxBackground);
  padding: 4px 6px;
  color: var(--InputBoxForeground);
  font-size: 13px;
  height: 24px;
  contain: strict;
  resize: none;
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
}
.ChatSendArea:focus-within{
  border-color: darkcyan;
}

.SendButtonDisabled{
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-disabledForeground);
  cursor: default;
}

.ChatModelPicker{
  border: 1px solid white;
}

.ChatListItem{
  display:flex;
  align-items:center;
  box-shadow: inset 0 0 0 1px transparent;
}

.ChatListItemFocused{
  background: var(--vscode-list-activeSelectionBackground);
  box-shadow: inset 0 0 0 1px var(--vscode-focusBorder);
  color: var(--vscode-list-activeSelectionForeground);
}

.ChatMessageContent p + p{
  margin-top: 0.75em;
}

.MissingApiKeyForm{
  padding-top: 10px;
}

a.Button{
  text-decoration: none;
}

.ChatHeaderLabel{
  margin: 0;
  font-size: 14px;
}

.ChatListItemStatusRow{
  width: 16px;
  min-width: 16px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.ChatListItemStatusIcon{
  font-size: 10px;
}

.ChatListItemStatusStopped{
  color: var(--vscode-disabledForeground);
}

.ChatListItemStatusInProgress{
  color: var(--vscode-charts-blue);
}

.ChatListItemStatusFinished{
  color: var(--vscode-testing-iconPassed);
}

.ChatListItem .SessionArchiveButton{
  opacity: 0;
}

.ChatListItem:hover .SessionArchiveButton,
.ChatListItem:focus-within .SessionArchiveButton{
  opacity: 1;
}

.ChatHeaderLabel{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ChatModelPickerList{
  margin:0;
  scrollbar-width: thin;
  scrollbar-color: var(--vscode-scrollbarSlider-background) transparent;
}

.ChatModelPickerList::-webkit-scrollbar{
  width: 10px;
}

.ChatModelPickerList::-webkit-scrollbar-track{
  background: transparent;
}

.ChatModelPickerList::-webkit-scrollbar-thumb{
  background: var(--vscode-scrollbarSlider-background);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
}

.ChatModelPickerList::-webkit-scrollbar-thumb:hover{
  background: var(--vscode-scrollbarSlider-hoverBackground);
  border: 2px solid transparent;
  background-clip: content-box;
}

.ChatModelPickerList::-webkit-scrollbar-thumb:active{
  background: var(--vscode-scrollbarSlider-activeBackground);
  border: 2px solid transparent;
  background-clip: content-box;
}

.ChatModelPickerItem{
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.ChatModelPickerItemLabel{
  min-width: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ChatModelPickerItemUsageCost{
  margin-left: auto;
  color: var(--vscode-descriptionForeground);
  opacity: 0.8;
}

.ChatModelPickerContainer{
  position: absolute;
  inset:0;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.ChatModelPicker {
  position: static;
  background: black;
  margin-top: auto;
  margin-bottom: 90px;
  pointer-events: auto;
}

`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

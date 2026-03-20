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

.ChatSendArea:focus-within{
  border-color: darkcyan;
}

.ChatListItem{
  display:flex;
  align-items:center;
}

.ChatMessageContent p + p{
  margin-top: 0.75em;
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
.ChatListItem .SessionArchiveButton{
  opacity: 0;
}

.ChatListItem:hover .SessionArchiveButton,
.ChatListItem:focus-within .SessionArchiveButton{
  opacity: 1;
}
`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

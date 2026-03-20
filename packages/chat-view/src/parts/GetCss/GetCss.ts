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
`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

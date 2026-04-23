export const getCss = (
  composerHeight: number,
  composerAttachmentsHeight: number,
  modelPickerHeight: number,
  listItemHeight: number,
  chatMessageFontSize: number,
  chatMessageLineHeight: number,
  chatMessageFontFamily: string,
  chatFocusContentMaxWidth: number,
  projectSidebarWidth: number,
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
  const runModePickerHeight = 84
  const chatSendAreaHeight =
    composerHeight + composerAttachmentsHeight + chatSendAreaPaddingTop + chatSendAreaPaddingBottom + buttonsHeight + gap + contentPadding * 2
  const baseCss = `:root {
  --ChatInputBoxHeight: ${composerHeight}px;
  --ChatComposerAttachmentsHeight: ${composerAttachmentsHeight}px;
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
  --ChatModelPickerHeight: ${modelPickerHeight}px;
  --ChatListItemHeight: ${listItemHeight}px;
  --ChatMessageFontSize: ${chatMessageFontSize}px;
  --ChatMessageLineHeight: ${chatMessageLineHeight}px;
  --ChatMessageFontFamily: ${chatMessageFontFamily};
  --ChatFocusContentMaxWidth: ${chatFocusContentMaxWidth}px;
  --ProjectSidebarWidth: ${projectSidebarWidth}px;
  --RunModePickerHeight: ${runModePickerHeight}px;
}

:root{
 --WidgetBorder: white;
 --ChatScrollbarThickness: 10px;
 --ChatScrollbarTrack: transparent;
 --ChatScrollbarThumb: var(--vscode-scrollbarSlider-background, rgba(121, 121, 121, 0.4));
 --ChatScrollbarThumbHover: var(--vscode-scrollbarSlider-hoverBackground, rgba(100, 100, 100, 0.7));
 --ChatScrollbarThumbActive: var(--vscode-scrollbarSlider-activeBackground, rgba(191, 191, 191, 0.4));
}

.ChatList,
.ProjectList,
.ChatMessages {
  scrollbar-width: thin;
  scrollbar-color: var(--ChatScrollbarThumb) var(--ChatScrollbarTrack);
}

.ChatList::-webkit-scrollbar,
.ProjectList::-webkit-scrollbar,
.ChatMessages::-webkit-scrollbar {
  width: var(--ChatScrollbarThickness);
  height: var(--ChatScrollbarThickness);
}

.ChatList::-webkit-scrollbar-track,
.ProjectList::-webkit-scrollbar-track,
.ChatMessages::-webkit-scrollbar-track {
  background: var(--ChatScrollbarTrack);
}

.ChatList::-webkit-scrollbar-thumb,
.ProjectList::-webkit-scrollbar-thumb,
.ChatMessages::-webkit-scrollbar-thumb {
  background: var(--ChatScrollbarThumb);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.ChatList::-webkit-scrollbar-thumb:hover,
.ProjectList::-webkit-scrollbar-thumb:hover,
.ChatMessages::-webkit-scrollbar-thumb:hover {
  background: var(--ChatScrollbarThumbHover);
  border: 2px solid transparent;
  background-clip: padding-box;
}

.ChatList::-webkit-scrollbar-thumb:active,
.ProjectList::-webkit-scrollbar-thumb:active,
.ChatMessages::-webkit-scrollbar-thumb:active {
  background: var(--ChatScrollbarThumbActive);
  border: 2px solid transparent;
  background-clip: padding-box;
}

.ChatList::-webkit-scrollbar-corner,
.ProjectList::-webkit-scrollbar-corner,
.ChatMessages::-webkit-scrollbar-corner {
  background: transparent;
}



.ChatSendAreaBottom{
  height: ${buttonsHeight}px;
}



`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

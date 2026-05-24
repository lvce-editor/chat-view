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

.ChatSendAreaBottom{
  height: ${buttonsHeight}px;
}

<<<<<<< HEAD
=======
.ChatListMoreToggle {
  list-style: none;
  display: flex;
  align-items: center;
  min-height: var(--ChatListItemHeight);
  padding: 0 6px;
}

.ChatListMoreToggleButton {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-height: 22px;
  padding: 0 6px 0 4px;
  border-radius: 4px;
  color: var(--vscode-descriptionForeground, var(--vscode-foreground));
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 0.04em;
  line-height: 1.4;
  text-transform: uppercase;
  user-select: none;
}

.ChatListMoreToggleButton:hover {
  background: var(--vscode-list-hoverBackground, rgba(255, 255, 255, 0.06));
  color: var(--vscode-list-hoverForeground, var(--vscode-foreground));
}

.ChatListMoreToggleButton:focus {
  background: var(--vscode-list-hoverBackground, rgba(255, 255, 255, 0.06));
  box-shadow: inset 0 0 0 1px var(--vscode-focusBorder, #007fd4);
  color: var(--vscode-list-hoverForeground, var(--vscode-foreground));
  outline: none;
}

.ChatListMoreToggleChevron {
  flex: none;
  width: 16px;
  height: 16px;
  opacity: 0.9;
}

.ChatListMoreToggleLabel {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}





@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

.LoadingText {
  background: linear-gradient(
    90deg,
    #888 25%,   /* dim color  */
    #fff 45%,   /* bright peak */
    #888 55%,
    #888 75%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s linear infinite;
}

>>>>>>> origin/main
`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

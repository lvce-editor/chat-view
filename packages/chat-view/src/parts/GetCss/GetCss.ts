/* eslint-disable @cspell/spellchecker */
export const getCss = (
  composerHeight: number,
  modelPickerHeight: number,
  listItemHeight: number,
  chatMessageFontSize: number,
  chatMessageLineHeight: number,
  chatMessageFontFamily: string,
  chatFocusContentMaxWidth: number,
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
  --ChatModelPickerHeight: ${modelPickerHeight}px;
  --ChatListItemHeight: ${listItemHeight}px;
  --ChatMessageFontSize: ${chatMessageFontSize}px;
  --ChatMessageLineHeight: ${chatMessageLineHeight}px;
  --ChatMessageFontFamily: ${chatMessageFontFamily};
  --ChatFocusContentMaxWidth: ${chatFocusContentMaxWidth}px;
}

.ChatSendAreaBottom{
  height: ${buttonsHeight}px;
}

.ChatToolCallFileName{
  cursor: pointer;
}

<<<<<<< HEAD
.ChatComposerAttachments{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.ChatComposerAttachment{
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 999px;
  border: 1px solid var(--vscode-widget-border, var(--vscode-panel-border));
  padding: 4px 10px;
  background: var(--vscode-badge-background, color-mix(in srgb, var(--vscode-editor-background) 88%, white));
  color: var(--vscode-badge-foreground, var(--vscode-foreground));
  font-size: 12px;
}

.ChatComposerAttachmentImage{
  border-color: var(--vscode-charts-blue);
}

.ChatComposerAttachmentInvalidImage{
  border-color: var(--vscode-inputValidation-errorBorder, var(--vscode-errorForeground));
  color: var(--vscode-errorForeground, var(--vscode-foreground));
}

.ChatComposerAttachmentTextFile{
  border-color: var(--vscode-charts-green, var(--vscode-widget-border, var(--vscode-panel-border)));
}

.CustomSelectContainer{
  position: relative;
  min-width: 0;
=======
.ChatToolCallFileName:hover{
  color: var(--vscode-textLink-foreground);
>>>>>>> origin/main
}

`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

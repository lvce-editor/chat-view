export const getCss = (
  composerHeight: number,
  composerAttachmentsHeight: number,
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
}

.ChatSendAreaBottom{
  height: ${buttonsHeight}px;
}

.ChatToolCallFileName{
  cursor: pointer;
}

.ChatComposerAttachments{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.ChatComposerAttachment{
  align-items: center;
  display: inline-flex;
  gap: 6px;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--vscode-widget-border, var(--vscode-panel-border));
  padding: 4px 10px;
  background: var(--vscode-badge-background, color-mix(in srgb, var(--vscode-editor-background) 88%, white));
  color: var(--vscode-badge-foreground, var(--vscode-foreground));
  font-size: 12px;
}

.ChatComposerAttachmentLabel{
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ChatComposerAttachmentPreview{
  width: 20px;
  height: 20px;
  flex: none;
  border-radius: 4px;
  object-fit: cover;
}

.ChatComposerAttachmentRemoveButton{
  appearance: none;
  background: transparent;
  border: none;
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  flex-shrink: 0;
  font: inherit;
  line-height: 1;
  margin: 0;
  padding: 0;
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

.Chat{
  position: relative;
}

.ChatComposerAttachmentPreviewOverlay{
  position: absolute;
  left: calc(var(--ChatSendAreaPaddingLeft) + 8px);
  bottom: calc(var(--ChatSendAreaHeight) - 12px);
  z-index: 6;
  width: 240px;
  min-width: 160px;
  min-height: 160px;
  max-width: calc(100% - var(--ChatSendAreaPaddingLeft) - var(--ChatSendAreaPaddingRight) - 16px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vscode-widget-border, var(--vscode-panel-border));
  border-radius: 12px;
  background: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--vscode-editor-background) 45%, black);
  overflow: hidden;
}

.ChatComposerAttachmentPreviewOverlayImage{
  display: block;
  width: 100%;
  max-width: 100%;
  max-height: min(320px, calc(100vh - 200px));
  object-fit: contain;
  background: color-mix(in srgb, var(--vscode-editor-background) 88%, black);
}

.ChatComposerAttachmentPreviewOverlayError{
  padding: 12px;
  color: var(--vscode-errorForeground, var(--vscode-foreground));
}

.CustomSelectContainer{
  position: relative;
  min-width: 0;

}

.ChatGitBranchPickerMessage{
  padding: 6px 8px;
}

.ChatGitBranchPickerErrorMessage{
  color: var(--vscode-errorForeground, var(--vscode-foreground));
}

.RunModePickerContainer{
  display: flex;
  justify-content: flex-end;
}

.ChatOverlays{
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ChatOverlays > *{
  pointer-events: auto;
}

.ChatViewDropOverlayActive{
  background: rgba(255, 255, 255, 0.1);
}

.RunModePickerPopOver{
  overflow: hidden;
  border: 1px solid var(--vscode-widget-border, var(--vscode-panel-border));
  border-radius: 8px;
  background: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--vscode-editor-background) 50%, black);
}

.ChatToolCallFileName:hover{
  color: var(--vscode-textLink-foreground);
}

.ChatOrderedListItem{
  align-items: flex-start;
  display: flex;
  gap: 8px;
}

.ChatOrderedListMarker{
  flex: none;
  min-width: 1.5em;
}

.ChatOrderedListItemContent{
  flex: 1;
  min-width: 0;
}

.ChatOrderedListItemPrefix{
  white-space: nowrap;
}

.ChatToolCalls .ChatOrderedList{
  list-style: none;
  margin: 0;
  padding: 0;
}

.ChatToolCalls .ChatOrderedListItem{
  align-items: flex-start;
  display: flex;
  gap: 8px;
}

.ChatToolCalls .ChatOrderedListMarker{
  flex: none;
  min-width: 1.5em;
}

.ChatToolCalls .ChatOrderedListItemContent{
  flex: 1;
  min-width: 0;
}

.ChatMessages > .Message{
  display: flex;
}

.ChatMessages > .MessageUser{
  justify-content: flex-end;
}

.ChatMessages > .MessageAssistant{
  justify-content: flex-start;
}

.ChatFocus .ChatMessages > .Message{
  inline-size: fit-content;
  max-inline-size: min(100%, var(--ChatFocusContentMaxWidth));
}

.ChatFocus .ChatMessages > .Message > .ChatMessageContent{
  max-inline-size: 100%;
}
`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

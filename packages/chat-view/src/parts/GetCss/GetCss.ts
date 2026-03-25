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

*{
  scrollbar-width: thin;
  scrollbar-color: var(--vscode-scrollbarSlider-background) transparent;
}

*::-webkit-scrollbar{
  width: 10px;
  height: 10px;
}

*::-webkit-scrollbar-track{
  background: transparent;
}

*::-webkit-scrollbar-corner{
  background: transparent;
}

*::-webkit-scrollbar-thumb{
  background: var(--vscode-scrollbarSlider-background);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
}

*::-webkit-scrollbar-thumb:hover{
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

*::-webkit-scrollbar-thumb:active{
  background: var(--vscode-scrollbarSlider-activeBackground);
}

.ChatSendAreaBottom{
  height: ${buttonsHeight}px;
  display:flex;
  align-items:center;
  gap: 8px;
}

.ChatSendAreaPrimaryControls{
  min-width: 0;
  display:flex;
  align-items:center;
  gap: 8px;
  margin-right:auto;
}

.CustomSelectContainer{
  position: relative;
  min-width: 0;
}

.Select .MaskIcon {
  width: 20px;
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
  border: 1px solid var(--vscode-widget-border, var(--vscode-panel-border));
}

.Select:hover{
  background: var(--vscode-toolbar-hoverBackground, color-mix(in srgb, var(--vscode-editor-background) 80%, white));
}

button.Select[name='model-picker-toggle'],
button.Select[name='run-mode-picker-toggle']{
  display: flex;
  gap: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-descriptionForeground, var(--vscode-disabledForeground));
  padding:0 !important;
  min-width: 0;
}

button.Select[name='model-picker-toggle']:hover,
button.Select[name='run-mode-picker-toggle']:hover{
  background: var(--vscode-toolbar-hoverBackground, color-mix(in srgb, var(--vscode-editor-background) 80%, white));
  color: var(--vscode-foreground);
}

button.Select[name='model-picker-toggle'] .SelectLabel,
button.Select[name='run-mode-picker-toggle'] .SelectLabel{
  width: auto;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

.ChatFocus .ChatMessages > .Message,
.ChatFocus .ChatSendAreaContent{
  width: min(100%, var(--ChatFocusContentMaxWidth));
  margin-left: auto;
  margin-right: auto;
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
  flex: 1;
  min-height: 0;
  margin:0;
  overflow-y: auto;
}

.ChatModelPickerItem{
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  width: 100%;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0 8px;
  text-align: left;
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
  opacity: 0.6;
}

.ChatModelPickerItem:hover{
  background: var(--vscode-list-hoverBackground);
  color: var(--vscode-list-hoverForeground);
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
  display: flex;
  flex-direction: column;
  background: var(--MainBackground) !important;
  height: var(--ChatModelPickerHeight);
  max-height: 240px;
  max-width: 300px;
  margin-left: 8px;
  margin-top: auto;
  margin-bottom: 90px;
  contain: strict;
  pointer-events: auto;
}

@media (max-width: 320px) {
  .ChatModelPicker {
    margin-left: 0;
  }
}

.CustomSelectPopOver{
  position: absolute;
  left: 0;
  bottom: calc(100% + 8px);
  margin: 0;
  z-index: 1;
}


.ChatModelPickerList{
  padding:0;
}

.Chat .Select {
  align-items: center;
  padding-left: 7px !important;
  padding-right: 1px !important;
  max-width: 300px !important;
}

.Chat .Select:hover{
  background: blue !important;
}

.SelectLabel{
  font-size: 11px;
  display: flex;
  contain:content;
  align-items: center;
  pointer-events: none;
}

.Select .MaskIcon {
  width: 10px !important;
  height: 10px !important;
  pointer-events: none;
}

.ChatInputBox{
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.ChatModelPickerItemSelected{
  background: var(--ListHoverBackground) !important;
}

.ChatModelPickerItem > *{
  pointer-events: none;
}

.ChatInputBox::selection{
  background: rgba(255, 255, 255, 0.2);
}

.ChatInputBox::-moz-selection{
  background: rgba(255, 255, 255, 0.2);
}

.SendButtonDisabled {
  color: rgba(204, 204, 204, 0.5) !important;
}
`

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

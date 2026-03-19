export const getCss = (
  composerHeight: number,
  listItemHeight: number,
  chatMessageFontSize: number,
  chatMessageLineHeight: number,
  chatMessageFontFamily: string,
  renderHtmlCss: string,
): string => {
  const baseCss = `:root {
  --ChatInputBoxHeight: ${composerHeight}px;
  --ChatTextAreaHeight: ${composerHeight}px;
  --ChatSendAreaHeight: ${composerHeight + 62}px;
  --ChatListItemHeight: ${listItemHeight}px;
  --ChatMessageFontSize: ${chatMessageFontSize}px;
  --ChatMessageLineHeight: ${chatMessageLineHeight}px;
  --ChatMessageFontFamily: ${chatMessageFontFamily};
}

.Viewlet.Chat.ChatFocus {
  background: linear-gradient(180deg, var(--ColorViewBackground, #1d2229) 0%, #1f252d 100%);
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr auto;
}

.Chat.ChatFocus .ChatHeader {
  grid-column: 1 / 3;
}

.Chat.ChatFocus .ProjectSidebar {
  background: color-mix(in srgb, var(--ColorSideBarBackground, #232b35) 88%, #1f2b38 12%);
  border-right: 1px solid var(--ColorBorder, #3a3d41);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 2 / 4;
  min-height: 0;
}

.Chat.ChatFocus .ProjectList {
  min-height: 0;
  overflow: auto;
  padding: 10px 8px 12px;
  scrollbar-color: color-mix(in srgb, var(--ColorScrollBarSliderBackground, #4b5563) 78%, transparent)
    color-mix(in srgb, var(--ColorSideBarBackground, #232b35) 92%, transparent);
  scrollbar-width: thin;
}

.Chat.ChatFocus .ProjectList::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}

.Chat.ChatFocus .ProjectList::-webkit-scrollbar-track {
  background: color-mix(in srgb, var(--ColorSideBarBackground, #232b35) 94%, transparent);
  border-radius: 999px;
}

.Chat.ChatFocus .ProjectList::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ColorScrollBarSliderBackground, #4b5563) 70%, transparent);
  border: 2px solid color-mix(in srgb, var(--ColorSideBarBackground, #232b35) 94%, transparent);
  border-radius: 999px;
}

.Chat.ChatFocus .ProjectList::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ColorScrollBarSliderHoverBackground, #667284) 80%, transparent);
}

.ProjectListGroup {
  border: 1px solid transparent;
  border-radius: 8px;
  margin-bottom: 6px;
  overflow: hidden;
}

.ProjectListItem {
  align-items: center;
  display: flex;
  gap: 6px;
  min-height: calc(var(--ChatListItemHeight) - 2px);
}

.ProjectListItemLabel {
  align-items: center;
  border-radius: 6px;
  color: var(--ColorForeground, #d5dbe3);
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 500;
  gap: 2px;
  overflow: hidden;
  padding: 0 10px;
  text-overflow: ellipsis;
  transition: background-color 80ms ease, color 80ms ease;
  white-space: nowrap;
}

.ProjectListChevron {
  color: color-mix(in srgb, var(--ColorForeground, #c8d0da) 70%, transparent);
  display: inline-block;
  flex: 0 0 12px;
  font-size: 11px;
  margin-right: 4px;
  text-align: center;
  width: 12px;
}

.ProjectListItemSelected {
  background: color-mix(in srgb, var(--ColorListInactiveSelectionBackground, #39424d) 84%, #2f3741 16%);
}

.ProjectListItem:not(.ProjectListItemSelected):hover,
.ProjectListItem:not(.ProjectListItemSelected):focus-within {
  background: color-mix(in srgb, var(--ColorListHoverBackground, #38414b) 50%, transparent);
}

.ProjectListItemSelected .ProjectListItemLabel {
  color: var(--ColorListInactiveSelectionForeground, #e5ebf2);
}

.ProjectListItemActions {
  display: flex;
  padding-right: 6px;
}

.ProjectListItemAddChatButton {
  align-items: center;
  background: color-mix(in srgb, var(--ColorButtonSecondaryBackground, #3a434f) 76%, transparent);
  border: 0;
  border-radius: 5px;
  color: var(--ColorForeground, #d0d8e2);
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 500;
  height: 18px;
  justify-content: center;
  opacity: 0;
  padding: 0;
  transition: opacity 90ms ease, background-color 90ms ease;
  visibility: hidden;
  width: 18px;
}

.ProjectListItem:hover .ProjectListItemAddChatButton,
.ProjectListItem:focus-within .ProjectListItemAddChatButton {
  opacity: 1;
  visibility: visible;
}

.ProjectListItemAddChatButton:hover,
.ProjectListItemAddChatButton:focus-visible {
  background: color-mix(in srgb, var(--ColorButtonSecondaryHoverBackground, #4a5460) 82%, transparent);
}

.ProjectSessionItem {
  align-items: center;
  display: flex;
  min-height: calc(var(--ChatListItemHeight) - 5px);
}

.ProjectSessionItemLabel {
  border-radius: 6px;
  color: color-mix(in srgb, var(--ColorForeground, #cfd7df) 92%, transparent);
  cursor: pointer;
  display: block;
  flex: 1;
  font-size: 12.5px;
  overflow: hidden;
  padding: 0 10px 0 28px;
  text-overflow: ellipsis;
  transition: background-color 80ms ease, color 80ms ease;
  white-space: nowrap;
}

.ProjectSessionItemSelected {
  background: color-mix(in srgb, var(--ColorListInactiveSelectionBackground, #353f4a) 86%, #2c3540 14%);
}

.ProjectSessionItem:not(.ProjectSessionItemSelected):hover,
.ProjectSessionItem:not(.ProjectSessionItemSelected):focus-within {
  background: color-mix(in srgb, var(--ColorListHoverBackground, #38414c) 46%, transparent);
}

.ProjectSessionItemSelected .ProjectSessionItemLabel {
  color: var(--ColorListInactiveSelectionForeground, #f2f6fc);
}

.Chat.ChatFocus .ProjectAddButton {
  background: color-mix(in srgb, var(--ColorButtonSecondaryBackground, #21252c) 72%, transparent);
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--ColorBorder, #3a3d41) 70%, transparent);
  color: var(--ColorForeground, #d2d9e2);
  cursor: pointer;
  font-size: 12.5px;
  letter-spacing: 0.01em;
  margin-top: auto;
  min-height: var(--ChatListItemHeight);
  padding: 0 12px;
  text-align: left;
  transition: background-color 80ms ease;
}

.Chat.ChatFocus .ProjectAddButton:hover,
.Chat.ChatFocus .ProjectAddButton:focus-visible {
  background: color-mix(in srgb, var(--ColorButtonSecondaryHoverBackground, #2a3039) 78%, transparent);
}

.ChatList,
.ChatListEmpty,
.ChatMessages {
  min-height: 0;
}

.Chat.ChatFocus .ChatList,
.Chat.ChatFocus .ChatListEmpty {
  display: none;
}

.Chat.ChatFocus .ChatMessages {
  grid-column: 2;
  grid-row: 2;
}

.Chat.ChatFocus .ChatSendArea {
  grid-column: 2;
  grid-row: 3;
  height: var(--ChatSendAreaHeight);
  min-height: var(--ChatSendAreaHeight);
}

.Chat .MultilineInputBox {
  height: var(--ChatTextAreaHeight);
  min-height: var(--ChatTextAreaHeight);
}

.MarkdownMathInline {
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
}

.MarkdownQuote {
  border-left: 3px solid var(--ColorBorder, #3a3d41);
  margin: 8px 0;
  padding-left: 12px;
}

.MarkdownMathBlock {
  margin: 8px 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.StrikeThrough {
  text-decoration: line-through;
}

/* syntax highlight token colors */
.TokenComment {
  color: var(--ColorSymbolIconColorForeground, #7f8794);
}

.TokenString {
  color: var(--ColorChartsGreen, #a6d189);
}

.TokenNumber,
.TokenValue {
  color: var(--ColorChartsBlue, #8caaee);
}

.TokenKeyword,
.TokenTag {
  color: var(--ColorChartsPurple, #ca9ee6);
}

.TokenAttribute,
.TokenProperty {
  color: var(--ColorChartsOrange, #ef9f76);
}

.ChatToolCallQuestionText {
  margin-bottom: 6px;
}

.ChatToolCallQuestionOptions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ChatToolCallQuestionOption {
  background: color-mix(in srgb, var(--ColorBadgeBackground, #2f3640) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--ColorBorder, #3a3d41) 70%, transparent);
  border-radius: 999px;
  color: var(--ColorForeground, #d5dbe3);
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  padding: 2px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`

  if (!renderHtmlCss.trim()) {
    return baseCss
  }

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

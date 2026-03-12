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
  --ChatListItemHeight: ${listItemHeight}px;
  --ChatMessageFontSize: ${chatMessageFontSize}px;
  --ChatMessageLineHeight: ${chatMessageLineHeight}px;
  --ChatMessageFontFamily: ${chatMessageFontFamily};
}

.Viewlet.Chat.ChatFocus {
  background: linear-gradient(180deg, var(--ColorViewBackground, #181a1f) 0%, #161a1f 100%);
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr auto;
}

.Chat.ChatFocus .ChatHeader {
  grid-column: 1 / 3;
}

.Chat.ChatFocus .ProjectSidebar {
  background: color-mix(in srgb, var(--ColorSideBarBackground, #1a1d22) 90%, #0e141b 10%);
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
  background: color-mix(in srgb, var(--ColorListActiveSelectionBackground, #0b4f77) 86%, #032235 14%);
}

.ProjectListItem:not(.ProjectListItemSelected) .ProjectListItemLabel:hover,
.ProjectListItem:not(.ProjectListItemSelected) .ProjectListItemLabel:focus-visible {
  background: color-mix(in srgb, var(--ColorListHoverBackground, #2a323d) 65%, transparent);
}

.ProjectListItemSelected .ProjectListItemLabel {
  color: var(--ColorListActiveSelectionForeground, #f7fbff);
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
  background: color-mix(in srgb, var(--ColorListInactiveSelectionBackground, #2a2d31) 84%, #10151b 16%);
}

.ProjectSessionItem:not(.ProjectSessionItemSelected) .ProjectSessionItemLabel:hover,
.ProjectSessionItem:not(.ProjectSessionItemSelected) .ProjectSessionItemLabel:focus-visible {
  background: color-mix(in srgb, var(--ColorListHoverBackground, #2b323c) 55%, transparent);
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
}
`

  if (!renderHtmlCss.trim()) {
    return baseCss
  }

  return `${baseCss}

/* render_html tool css */
${renderHtmlCss}`
}

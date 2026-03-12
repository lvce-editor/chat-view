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
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr auto;
}

.Chat.ChatFocus .ChatHeader {
  grid-column: 1 / 3;
}

.Chat.ChatFocus .ProjectSidebar {
  border-right: 1px solid var(--ColorBorder, #3a3d41);
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 2 / 4;
  min-height: 0;
}

.Chat.ChatFocus .ProjectList {
  min-height: 0;
  overflow: auto;
}

.ProjectListGroup {
  border-bottom: 1px solid var(--ColorBorder, #3a3d41);
}

.ProjectListItem {
  align-items: center;
  display: flex;
  min-height: var(--ChatListItemHeight);
}

.ProjectListItemLabel {
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  padding: 0 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ProjectListItemSelected {
  background: var(--ColorListActiveSelectionBackground, #04395e);
}

.ProjectSessionItem {
  align-items: center;
  display: flex;
  min-height: var(--ChatListItemHeight);
}

.ProjectSessionItemLabel {
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  padding: 0 12px 0 28px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ProjectSessionItemSelected {
  background: var(--ColorListInactiveSelectionBackground, #2a2d31);
}

.Chat.ChatFocus .ProjectAddButton {
  background: transparent;
  border: 0;
  border-top: 1px solid var(--ColorBorder, #3a3d41);
  color: inherit;
  cursor: pointer;
  margin-top: auto;
  min-height: var(--ChatListItemHeight);
  text-align: left;
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

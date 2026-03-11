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

.Viewlet.Chat {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
}

.ChatHeader {
  grid-column: 1 / 3;
}

.ProjectSidebar {
  border-right: 1px solid var(--ColorBorder, #3a3d41);
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 2 / 4;
  min-height: 0;
}

.ProjectList {
  min-height: 0;
  overflow: auto;
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

.ProjectAddButton {
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
  grid-column: 2;
  grid-row: 2;
  min-height: 0;
}

.ChatSendArea {
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

import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import { getMenuEntriesChatHeader } from '../GetMenuEntriesChatHeader/GetMenuEntriesChatHeader.ts'
import { getMenuEntriesChatInput } from '../GetMenuEntriesChatInput/GetMenuEntriesChatInput.ts'
import { getMenuEntriesChatList } from '../GetMenuEntriesChatList/GetMenuEntriesChatList.ts'
import { getMenuEntriesProjectAddButton } from '../GetMenuEntriesProjectAddButton/GetMenuEntriesProjectAddButton.ts'
import { getMenuEntriesChatProjectList } from '../GetMenuEntriesChatProjectList/GetMenuEntriesChatProjectList.ts'
import { MenuChatHeader, MenuChatInput, MenuChatList, MenuChatProjectList, MenuProjectAddButton } from '../GetMenuEntryIds/GetMenuEntryIds.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

const menuEntryOpenContainingFolder: MenuEntry = {
  command: 'Explorer.openContainingFolder',
  flags: MenuItemFlags.RestoreFocus,
  id: 'openContainingFolder',
  label: ViewletExplorerStrings.openContainingFolder(),
}

const menuEntryOpenInIntegratedTerminal: MenuEntry = {
  command: /* TODO */ '-1',
  flags: MenuItemFlags.None,
  id: 'openInIntegratedTerminal',
  label: ViewletExplorerStrings.openInIntegratedTerminal(),
}

const menuEntryCut: MenuEntry = {
  command: 'Explorer.handleCut',
  flags: MenuItemFlags.RestoreFocus,
  id: 'cut',
  label: ViewletExplorerStrings.cut(),
}

const menuEntryCopy: MenuEntry = {
  command: 'Explorer.handleCopy',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copy',
  label: ViewletExplorerStrings.copy(),
}

const menuEntryPaste: MenuEntry = {
  command: 'Explorer.handlePaste',
  flags: MenuItemFlags.None,
  id: 'paste',
  label: ViewletExplorerStrings.paste(),
}

const menuEntryCopyPath: MenuEntry = {
  command: 'Explorer.copyPath',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copyPath',
  label: ViewletExplorerStrings.copyPath(),
}

const menuEntryCopyAsE2eTest: MenuEntry = {
  command: 'Chat.copyAsE2eTest',
  flags: MenuItemFlags.None,
  id: 'copyAsE2eTest',
  label: ViewletExplorerStrings.copyPath(),
}

const menuEntryCopyRelativePath: MenuEntry = {
  command: 'Explorer.copyRelativePath',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copyRelativePath',
  label: ViewletExplorerStrings.copyRelativePath(),
}

const menuEntryRename: MenuEntry = {
  command: 'Explorer.renameDirent',
  flags: MenuItemFlags.None,
  id: 'rename',
  label: ViewletExplorerStrings.rename(),
}

const menuEntryDelete: MenuEntry = {
  command: 'Explorer.removeDirent',
  flags: MenuItemFlags.None,
  id: 'delete',
  label: ViewletExplorerStrings.deleteItem(),
}

const getMenuEntriesFile = (): readonly MenuEntry[] => {
  return [
    menuEntryCopyAsE2eTest,
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCut,
    menuEntryCopy,
    menuEntryPaste,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryRename,
    menuEntryDelete,
  ]
}

export interface ContextMenuProps {
  readonly menuId: number
  readonly [key: string]: any
}

export const getMenuEntries = (menuId: number, props: ContextMenuProps): readonly MenuEntry[] => {
  switch (props.menuId) {
    case MenuChatHeader:
      return getMenuEntriesChatHeader()
    case MenuChatInput:
      return getMenuEntriesChatInput()
    case MenuChatList:
      return getMenuEntriesChatList()
    case MenuProjectAddButton:
      return getMenuEntriesProjectAddButton()
    case MenuChatProjectList:
      return getMenuEntriesChatProjectList(props.projectId)
    default:
      return getMenuEntriesFile()
  }
}

import { MenuItemFlags } from '@lvce-editor/constants'
import type { ContextMenuProps } from '../GetMenuEntries/ContextMenuProps/ContextMenuProps.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatAttachment = ({ attachmentId = '', previewSrc = '' }: ContextMenuProps): readonly MenuEntry[] => {
  return [
    {
      args: [previewSrc],
      command: 'Chat.openChatAttachmentInNewTab',
      flags: MenuItemFlags.None,
      id: 'openImageInNewTab',
      // @ts-ignore
      label: ViewletChatStrings.openImageInNewTab(),
    },
    {
      args: [attachmentId],
      command: 'Chat.removeComposerAttachment',
      flags: MenuItemFlags.None,
      id: 'removeAttachment',
      // @ts-ignore
      label: ViewletChatStrings.removeAttachment(),
    },
  ]
}

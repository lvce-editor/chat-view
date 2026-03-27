import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatAttachment = (attachmentId: string, previewSrc: string): readonly MenuEntry[] => {
  return [
    {
      args: [previewSrc],
      command: 'Chat.openChatAttachmentInNewTab',
      flags: MenuItemFlags.None,
      id: 'openImageInNewTab',
      label: ViewletChatStrings.openImageInNewTab(),
    },
    {
      args: [attachmentId],
      command: 'Chat.removeComposerAttachment',
      flags: MenuItemFlags.None,
      id: 'removeAttachment',
      label: ViewletChatStrings.removeAttachment(),
    },
  ]
}
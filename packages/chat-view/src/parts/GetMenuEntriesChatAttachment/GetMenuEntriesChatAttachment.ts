import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'
import type { ContextMenuProps } from '../GetMenuEntries/ContextMenuProps/ContextMenuProps.ts'

type Props = Pick<ContextMenuProps, 'attachmentId' | 'previewSrc'>

export const getMenuEntriesChatAttachment = ({ attachmentId = '', previewSrc = '' }: Props = {}): readonly MenuEntry[] => {
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

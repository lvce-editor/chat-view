import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { MenuChatAttachment } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
import * as HandleContextMenuChatImageAttachment from '../src/parts/HandleContextMenuChatImageAttachment/HandleContextMenuChatImageAttachment.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

test('handleContextMenuChatImageAttachment should open the attachment context menu for image previews', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    composerAttachments: [
      {
        attachmentId: 'attachment-1',
        displayType: 'image' as const,
        mimeType: 'image/svg+xml',
        name: 'photo.svg',
        previewSrc: 'data:image/svg+xml;base64,abc',
        size: 10,
      },
    ],
    uid: 7,
  }

  const result = await HandleContextMenuChatImageAttachment.handleContextMenuChatImageAttachment(
    state,
    InputName.getComposerAttachmentPreviewInputName('attachment-1'),
    20,
    30,
  )

  expect(mockRpc.invocations).toEqual([
    ['ContextMenu.show2', 7, MenuChatAttachment, 20, 30, { attachmentId: 'attachment-1', menuId: MenuChatAttachment, previewSrc: 'data:image/svg+xml;base64,abc' }],
  ])
  expect(result).toBe(state)
})

test('handleContextMenuChatImageAttachment should ignore non-preview targets', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = createDefaultState()
  const result = await HandleContextMenuChatImageAttachment.handleContextMenuChatImageAttachment(state, 'composer', 20, 30)

  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})
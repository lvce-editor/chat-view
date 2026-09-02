import { expect, test } from '@jest/globals'
import { ChatStorageWorker, DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import type { ChatViewEvent } from '../src/parts/ChatViewEvent/ChatViewEvent.ts'
import { getChatViewEvents } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleDropFiles from '../src/parts/HandleDropFiles/HandleDropFiles.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

const imagePreviewSrcRegex = /^data:image\/svg\+xml;base64,/

const createFile = (name: string, type: string, content: string): File => {
  const blob = new Blob([content], { type })
  return Object.assign(blob, { name }) as File
}

test('handleDropFiles stores dropped files as attachment events', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: true,
    selectedSessionId: 'session-1',
  }
  const files = [createFile('photo.svg', 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>')]
  const dropId = 1
  const storedEvents: ChatViewEvent[] = []
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'(event: ChatViewEvent) {
      storedEvents.push(event)
    },

    'ChatStorage.getEvents'(sessionId: string) {
      return storedEvents.filter((event) => event.sessionId === sessionId)
    },
  })
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedFilesByDropId'() {
      return files
    },
  })

  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, dropId)

  expect(newState.composerDropActive).toBe(false)
  expect(newState.composerAttachments).toEqual([
    expect.objectContaining({
      displayType: 'image',
      mimeType: 'image/svg+xml',
      name: 'photo.svg',
      previewSrc: expect.stringMatching(imagePreviewSrcRegex),
      size: files[0].size,
    }),
  ])
  expect(newState.composerAttachmentsHeight).toBeGreaterThan(0)
  const events = await getChatViewEvents('session-1')
  expect(events).toHaveLength(1)
  expect(events[0]).toMatchObject({
    mimeType: 'image/svg+xml',
    name: 'photo.svg',
    sessionId: 'session-1',
    size: files[0].size,
    type: 'chat-attachment-added',
  })
  expect(events[0].type).toBe('chat-attachment-added')
  if (events[0].type !== 'chat-attachment-added') {
    throw new TypeError('Expected chat-attachment-added event')
  }
  expect(events[0].blob).toBeInstanceOf(Blob)
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedFilesByDropId', dropId]])
  expect(mockRpc.invocations).toEqual([
    ['ChatStorage.appendEvent', expect.objectContaining({ name: 'photo.svg', sessionId: 'session-1' })],
    ['ChatStorage.getEvents', 'session-1'],
  ])
})

test('handleDropFiles resolves an opt-in drop session through drag-and-drop-worker', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: true,
    selectedSessionId: 'session-drop-id',
  }
  const file = createFile('notes.txt', 'text/plain', 'hello')
  using _storageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'() {},
  })
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedFilesByDropId'() {
      return [file]
    },
  })

  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, 31)

  expect(newState.composerAttachments).toHaveLength(1)
  expect(newState.composerAttachments[0].name).toBe('notes.txt')
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedFilesByDropId', 31]])
})

test('handleDropFiles is no-op when no session is selected', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: true,
    selectedSessionId: '',
  }

  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.discardDrop'() {},
  })
  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, 7)

  expect(newState.composerDropActive).toBe(false)
  expect(newState.composerAttachments).toHaveLength(0)
  expect(newState.composerAttachmentsHeight).toBe(0)
  expect(dragRpc.invocations).toEqual([['DragAndDrop.discardDrop', 7]])
})

test('handleDropFiles keeps duplicate images when the same image is dropped twice', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-duplicate-image',
  }
  const file = createFile('photo.svg', 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>')
  const storedEvents: ChatViewEvent[] = []
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'(event: ChatViewEvent) {
      storedEvents.push(event)
    },

    'ChatStorage.getEvents'(sessionId: string) {
      return storedEvents.filter((event) => event.sessionId === sessionId)
    },
  })
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedFilesByDropId'() {
      return [file]
    },
  })

  const firstState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, 1)
  const secondState = await HandleDropFiles.handleDropFiles(firstState, InputName.ComposerDropTarget, 2)

  expect(secondState.composerAttachments).toHaveLength(2)
  expect(secondState.composerAttachments).toEqual([
    expect.objectContaining({
      displayType: 'image',
      mimeType: 'image/svg+xml',
      name: 'photo.svg',
      previewSrc: expect.stringMatching(imagePreviewSrcRegex),
      size: file.size,
    }),
    expect.objectContaining({
      displayType: 'image',
      mimeType: 'image/svg+xml',
      name: 'photo.svg',
      previewSrc: expect.stringMatching(imagePreviewSrcRegex),
      size: file.size,
    }),
  ])
  expect(secondState.composerAttachments[0].attachmentId).not.toBe(secondState.composerAttachments[1].attachmentId)
  expect(secondState.composerAttachmentsHeight).toBeGreaterThan(0)
  const events = await getChatViewEvents('session-duplicate-image')
  expect(events).toHaveLength(2)
  expect(events).toEqual([
    expect.objectContaining({
      mimeType: 'image/svg+xml',
      name: 'photo.svg',
      sessionId: 'session-duplicate-image',
      size: file.size,
      type: 'chat-attachment-added',
    }),
    expect.objectContaining({
      mimeType: 'image/svg+xml',
      name: 'photo.svg',
      sessionId: 'session-duplicate-image',
      size: file.size,
      type: 'chat-attachment-added',
    }),
  ])
  expect(mockRpc.invocations).toEqual([
    ['ChatStorage.appendEvent', expect.objectContaining({ name: 'photo.svg', sessionId: 'session-duplicate-image' })],
    ['ChatStorage.appendEvent', expect.objectContaining({ name: 'photo.svg', sessionId: 'session-duplicate-image' })],
    ['ChatStorage.getEvents', 'session-duplicate-image'],
  ])
  expect(dragRpc.invocations).toEqual([
    ['DragAndDrop.getDroppedFilesByDropId', 1],
    ['DragAndDrop.getDroppedFilesByDropId', 2],
  ])
})

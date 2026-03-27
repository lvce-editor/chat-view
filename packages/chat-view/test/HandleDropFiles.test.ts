import { expect, test } from '@jest/globals'
import { ChatStorageWorker, RendererWorker } from '@lvce-editor/rpc-registry'
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

const createFileHandle = (file: File): FileSystemFileHandle => {
  const fileHandle: FileSystemFileHandle = {
    createSyncAccessHandle: async (): Promise<FileSystemSyncAccessHandle> => {
      throw new Error('Not implemented in test')
    },
    createWritable: async (): Promise<FileSystemWritableFileStream> => {
      throw new Error('Not implemented in test')
    },
    getFile: async (): Promise<File> => file,
    isSameEntry: async (other: FileSystemHandle): Promise<boolean> => other.name === file.name && other.kind === 'file',
    kind: 'file',
    name: file.name,
  }
  return fileHandle
}

test('handleDropFiles stores dropped files as attachment events', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: true,
    selectedSessionId: 'session-1',
  }
  const files = [createFile('photo.svg', 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>')]
  const fileHandleIds = [1]
  const fileHandles = [createFileHandle(files[0])]
  const storedEvents: ChatViewEvent[] = []
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'(event: ChatViewEvent) {
      storedEvents.push(event)
    },

    'ChatStorage.getEvents'(sessionId: string) {
      return storedEvents.filter((event) => event.sessionId === sessionId)
    },
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'(ids: readonly number[]) {
      expect(ids).toEqual(fileHandleIds)
      return fileHandles.map((fileHandle) => ({ value: fileHandle }))
    },
  })

  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, fileHandleIds)

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
  expect(mockRendererRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', fileHandleIds]])
  expect(mockRpc.invocations).toEqual([
    ['ChatStorage.appendEvent', expect.objectContaining({ name: 'photo.svg', sessionId: 'session-1' })],
    ['ChatStorage.getEvents', 'session-1'],
  ])
})

test('handleDropFiles is no-op when no session is selected', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    composerDropActive: true,
    selectedSessionId: '',
  }

  const files = [createFile('note.txt', 'text/plain', 'hello')]
  const fileHandleIds = [7]
  const fileHandles = [createFileHandle(files[0])]
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getEvents'() {
      return []
    },
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'(ids: readonly number[]) {
      expect(ids).toEqual(fileHandleIds)
      return fileHandles.map((fileHandle) => ({ value: fileHandle }))
    },
  })
  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, fileHandleIds)

  expect(newState.composerDropActive).toBe(false)
  expect(newState.composerAttachments).toHaveLength(0)
  expect(newState.composerAttachmentsHeight).toBe(0)
  const events = await getChatViewEvents()
  expect(events).toHaveLength(0)
  expect(mockRendererRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', fileHandleIds]])
  expect(mockRpc.invocations).toEqual([['ChatStorage.getEvents', undefined]])
})

test('handleDropFiles keeps duplicate images when the same image is dropped twice', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    selectedSessionId: 'session-duplicate-image',
  }
  const file = createFile('photo.svg', 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>')
  const fileHandleIds = [1]
  const fileHandles = [createFileHandle(file)]
  const storedEvents: ChatViewEvent[] = []
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'(event: ChatViewEvent) {
      storedEvents.push(event)
    },

    'ChatStorage.getEvents'(sessionId: string) {
      return storedEvents.filter((event) => event.sessionId === sessionId)
    },
  })
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'(ids: readonly number[]) {
      expect(ids).toEqual(fileHandleIds)
      return fileHandles.map((fileHandle) => ({ value: fileHandle }))
    },
  })

  const firstState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, fileHandleIds)
  const secondState = await HandleDropFiles.handleDropFiles(firstState, InputName.ComposerDropTarget, fileHandleIds)

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
  expect(mockRendererRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', fileHandleIds],
    ['FileSystemHandle.getFileHandles', fileHandleIds],
  ])
})

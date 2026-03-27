import { expect, test } from '@jest/globals'
import { ChatStorageWorker } from '@lvce-editor/rpc-registry'
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
  const storedEvents: ChatViewEvent[] = []
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.appendEvent'(event: ChatViewEvent) {
      storedEvents.push(event)
    },

    'ChatStorage.getEvents'(sessionId: string) {
      return storedEvents.filter((event) => event.sessionId === sessionId)
    },
  })

  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, files)

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
  using mockRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getEvents'() {
      return []
    },
  })
  const newState = await HandleDropFiles.handleDropFiles(state, InputName.ComposerDropTarget, files)

  expect(newState.composerDropActive).toBe(false)
  expect(newState.composerAttachments).toHaveLength(0)
  expect(newState.composerAttachmentsHeight).toBe(0)
  const events = await getChatViewEvents()
  expect(events).toHaveLength(0)
  expect(mockRpc.invocations).toEqual([['ChatStorage.getEvents', undefined]])
})

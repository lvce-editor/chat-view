import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ComposerAttachment } from '../src/parts/ViewModel/ViewModel.ts'
import { handleClickBack, type HandleClickBackState } from '../src/parts/HandleClickBack/HandleClickBack.ts'
import { getState, setState } from '../src/parts/ModelState/ModelState.ts'

const composerAttachments: readonly ComposerAttachment[] = [
  {
    attachmentId: 'attachment-1',
    displayType: 'file',
    mimeType: 'text/plain',
    name: 'file.txt',
    size: 1,
  },
]

const createState = (overrides: Partial<HandleClickBackState> = {}): HandleClickBackState => {
  return {
    chatInputHistory: [],
    chatInputHistoryIndex: -1,
    composerAttachments,
    composerAttachmentsHeight: 56,
    composerValue: '',
    focus: 'composer',
    focused: true,
    lastNormalViewMode: 'detail',
    messages: [],
    parsedMessages: [],
    projects: [{ id: 'project-1', name: 'Project 1', uri: 'file:///workspace' }],
    renamingSessionId: 'session-1',
    selectedModelId: 'model-1',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], title: 'Session 1' }],
    systemPrompt: '',
    uid: 301,
    viewMode: 'detail',
    ...overrides,
  }
}

test('handleClickBack should persist list mode and rerender', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Chat.rerenderWithQuery': async () => {},
  })
  const state = createState()

  setState(state.uid, state)

  const result = await handleClickBack(state)

  expect(result).toEqual({
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    lastNormalViewMode: 'list',
    renamingSessionId: '',
    viewMode: 'list',
  })
  expect(getState(state.uid)).toEqual(result)
  expect(mockRendererRpc.invocations).toEqual([['Chat.rerenderWithQuery', state.uid]])
})

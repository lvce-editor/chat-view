import { expect, test } from '@jest/globals'
import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetChatViewDom from '../src/parts/GetChatViewDom/GetChatViewDom.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

const models = [{ id: 'test', name: 'test', usageCost: 0 }] as const

const renderChatView = (overrides: Partial<GetChatViewDom.GetChatVirtualDomOptions> = {}): readonly VirtualDomNode[] => {
  const { parsedMessages: _parsedMessages, ...defaultState } = createDefaultState()
  return GetChatViewDom.getChatVirtualDom({
    ...defaultState,
    models,
    selectedModelId: 'test',
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], projectId: 'project-1', title: 'Chat 1' }],
    visibleModels: models,
    ...overrides,
  })
}

test('getChatVirtualDom should render git branch picker in chat focus mode when visible', () => {
  const result = renderChatView({
    gitBranches: [{ current: true, name: 'main' }],
    gitBranchPickerVisible: true,
    viewMode: 'chat-focus',
  })

  const toggle = result.find((node) => node.name === InputName.GitBranchPickerToggle)
  expect(toggle).toBeDefined()
})

test('getChatVirtualDom should not render git branch picker outside chat focus mode', () => {
  const result = renderChatView({
    gitBranches: [{ current: true, name: 'main' }],
    gitBranchPickerVisible: true,
    viewMode: 'detail',
  })

  const toggle = result.find((node) => node.name === InputName.GitBranchPickerToggle)
  expect(toggle).toBeUndefined()
})

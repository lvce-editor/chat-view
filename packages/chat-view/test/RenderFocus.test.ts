import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'

test('renderFocus should return focusSelector command for composer', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'composer', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="composer"]'])
})

test('renderFocus should return focusSelector command for send button', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'send-button', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="send"]'])
})

test('renderFocus should return focusSelector command for picker list', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'picker-list', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '.ChatOverlays .ChatModelPickerList'])
})

test('renderFocus should return focusSelector command for input', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'input', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="composer"]'])
})

test('renderFocus should return focusSelector command for header', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = { ...createDefaultState(), focus: 'header', focused: true }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="create-session"]'])
})

test('renderFocus should return chat-list selector for list focus when no list item is focused', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="chat-list"]'])
})

test('renderFocus should return focused session selector for list focus', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    listFocusedIndex: 0,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="session:session-1"]'])
})

test('renderFocus should fallback to chat-list when listFocusedIndex is out of range', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    listFocusedIndex: 99,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="chat-list"]'])
})

test('renderFocus should use filtered visible sessions for list focus', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    listFocusedIndex: 0,
    selectedProjectId: 'project-2',
    sessions: [
      {
        id: 'session-1',
        messages: [],
        projectId: 'project-1',
        title: 'A',
      },
      {
        id: 'session-2',
        messages: [],
        projectId: 'project-2',
        title: 'B',
      },
    ],
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="session:session-2"]'])
})

test('renderFocus should fallback to chat-list when filtered visible session is missing at index', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    listFocusedIndex: 0,
    selectedProjectId: 'project-2',
    sessions: [
      {
        id: 'session-1',
        messages: [],
        projectId: 'project-1',
        title: 'A',
      },
    ],
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="chat-list"]'])
})

test('renderFocus should keep all sessions visible when sessions have no assigned projects', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'list',
    focused: true,
    listFocusedIndex: 1,
    selectedProjectId: 'project-2',
    sessions: [
      {
        id: 'session-a',
        messages: [],
        title: 'A',
      },
      {
        id: 'session-b',
        messages: [],
        title: 'B',
      },
    ],
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="session:session-b"]'])
})

test('renderFocus should fallback to composer for unknown focus values', () => {
  const oldState: ChatState = createDefaultState()
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'unknown-focus' as ChatState['focus'],
    focused: true,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="composer"]'])
})

test('renderFocus should return focusSelector command for model picker search when opening new picker', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: false,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="model-picker-search"]'])
})

test('renderFocus should use normal focus selector when model picker was already open', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    modelPickerOpen: true,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'send-button',
    focused: true,
    modelPickerOpen: true,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '[name="send"]'])
})

test('renderFocus should focus picker list when agent mode picker opens', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    agentModePickerOpen: false,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    agentModePickerOpen: true,
    focus: 'picker-list',
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '.ChatOverlays .ChatModelPickerList'])
})

test('renderFocus should focus picker list when run mode picker opens', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    runModePickerOpen: false,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'picker-list',
    runModePickerOpen: true,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '.ChatOverlays .ChatModelPickerList'])
})

test('renderFocus should focus picker list when reasoning effort picker opens', () => {
  const oldState: ChatState = {
    ...createDefaultState(),
    reasoningEffortPickerOpen: false,
  }
  const newState: ChatState = {
    ...createDefaultState(),
    focus: 'picker-list',
    reasoningEffortPickerOpen: true,
  }
  const result = RenderFocus.renderFocus(oldState, newState)
  expect(result).toEqual([ViewletCommand.FocusSelector, '.ChatOverlays .ChatModelPickerList'])
})

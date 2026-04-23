import { expect, test } from '@jest/globals'
import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return expected listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toBeDefined()
  const searchListener = result.find((listener) => listener.params?.[0] === 'handleSearchValueChange')
  expect(searchListener).toBeDefined()
  const chatInputContextMenuListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleChatInputContextMenu)
  expect(chatInputContextMenuListener).toEqual({
    name: DomEventListenerFunctions.HandleChatInputContextMenu,
    params: ['handleChatInputContextMenu', EventExpression.ClientX, EventExpression.ClientY],
    preventDefault: true,
  })
  const modelPickerToggleListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickModelPickerToggle)
  expect(modelPickerToggleListener).toEqual({
    name: DomEventListenerFunctions.HandleClickModelPickerToggle,
    params: ['handleClickModelPickerToggle'],
  })
  const modelPickerContainerListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickModelPickerContainer)
  expect(modelPickerContainerListener).toEqual({
    name: DomEventListenerFunctions.HandleClickModelPickerContainer,
    params: ['handleClickModelPickerContainer'],
  })
  const agentModePickerToggleListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickAgentModePickerToggle)
  expect(agentModePickerToggleListener).toEqual({
    name: DomEventListenerFunctions.HandleClickAgentModePickerToggle,
    params: ['openAgentModePicker'],
  })
  const projectAddButtonContextMenuListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleProjectAddButtonContextMenu)
  expect(projectAddButtonContextMenuListener).toEqual({
    name: DomEventListenerFunctions.HandleProjectAddButtonContextMenu,
    params: ['handleProjectAddButtonContextMenu'],
    preventDefault: true,
  })
  const composerSelectionListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleComposerSelectionChange)
  expect(composerSelectionListener).toEqual({
    name: DomEventListenerFunctions.HandleComposerSelectionChange,
    params: ['setComposerSelection', 'event.target.selectionStart', 'event.target.selectionEnd'],
  })
  const modelPickerContextMenuListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleContextMenuChatModelPicker)
  expect(modelPickerContextMenuListener).toEqual({
    name: DomEventListenerFunctions.HandleContextMenuChatModelPicker,
    params: ['handleContextMenuChatModelPicker'],
    preventDefault: true,
  })
  const modelPickerListScrollListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleModelPickerListScroll)
  expect(modelPickerListScrollListener).toEqual({
    name: DomEventListenerFunctions.HandleModelPickerListScroll,
    params: ['handleModelPickerListScroll', 'event.target.scrollTop'],
    passive: true,
  })
  const gitBranchPickerToggleListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickGitBranchPickerToggle)
  expect(gitBranchPickerToggleListener).toEqual({
    name: DomEventListenerFunctions.HandleClickGitBranchPickerToggle,
    params: ['handleClickGitBranchPickerToggle'],
  })
  const projectSidebarSashPointerMoveListener = result.find(
    (listener) => listener.name === DomEventListenerFunctions.HandlePointerMoveProjectSidebarSash,
  )
  expect(projectSidebarSashPointerMoveListener).toEqual({
    name: DomEventListenerFunctions.HandlePointerMoveProjectSidebarSash,
    params: ['handlePointerMoveProjectSidebarSash', EventExpression.ClientX],
  })
})

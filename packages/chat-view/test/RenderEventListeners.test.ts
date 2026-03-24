import { expect, test } from '@jest/globals'
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
    params: ['handleChatInputContextMenu'],
    preventDefault: true,
  })
  const modelPickerToggleListener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickModelPickerToggle)
  expect(modelPickerToggleListener).toEqual({
    name: DomEventListenerFunctions.HandleClickModelPickerToggle,
    params: ['handleClickModelPickerToggle'],
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
})

import { expect, test } from '@jest/globals'
import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenersFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return expected listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toEqual([
    {
      name: DomEventListenersFunctions.HandleListContextMenu,
      params: ['handleChatListContextMenu', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', EventExpression.TargetName, 'event.target.dataset.id'],
    },
    {
      name: DomEventListenersFunctions.HandleClickReadFile,
      params: ['handleClickReadFile', 'event.target.dataset.uri'],
    },
    {
      name: DomEventListenersFunctions.HandleClickDelete,
      params: ['handleClickDelete', 'event.target.dataset.id'],
    },
    {
      name: DomEventListenersFunctions.HandleClickClose,
      params: ['handleClickClose'],
    },
    {
      name: DomEventListenersFunctions.HandleClickSettings,
      params: ['handleClickSettings'],
    },
    {
      name: DomEventListenersFunctions.HandleClickNew,
      params: ['handleClickNew'],
    },
    {
      name: DomEventListenersFunctions.HandleClickSessionDebug,
      params: ['handleClickSessionDebug'],
    },
    {
      name: DomEventListenersFunctions.HandleClickBack,
      params: ['handleClickBack'],
    },
    {
      name: DomEventListenersFunctions.HandleClickList,
      params: ['handleClickList', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleInput,
      params: ['handleInput', EventExpression.TargetName, EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleDragEnter,
      params: ['handleDragEnter', EventExpression.TargetName, 'Array.from(event.dataTransfer?.files || []).length > 0'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOver,
      params: ['handleDragOver', EventExpression.TargetName, 'Array.from(event.dataTransfer?.files || []).length > 0'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave', EventExpression.TargetName],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDrop,
      params: ['handleDropFiles', EventExpression.TargetName, 'Array.from(event.dataTransfer?.files || [])'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragEnterChatView,
      params: ['handleDragEnter', 'composer-drop-target', 'Array.from(event.dataTransfer?.files || []).length > 0'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOverChatView,
      params: ['handleDragOver', 'composer-drop-target', 'Array.from(event.dataTransfer?.files || []).length > 0'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleModelChange,
      params: ['handleModelChange', EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleChatListScroll,
      params: ['handleChatListScroll', 'event.target.scrollTop'],
    },
    {
      name: DomEventListenersFunctions.HandleMessagesScroll,
      params: ['handleMessagesScroll', 'event.target.scrollTop'],
    },
    {
      name: DomEventListenersFunctions.HandleProjectListScroll,
      params: ['handleProjectListScroll', 'event.target.scrollTop'],
    },
    {
      name: DomEventListenersFunctions.HandleProjectListContextMenu,
      params: ['handleProjectListContextMenu'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleMessagesContextMenu,
      params: ['handleMessagesContextMenu'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleFocus,
      params: ['handleInputFocus', EventExpression.TargetName],
    },
    {
      name: DomEventListenersFunctions.HandleKeyDown,
      params: ['handleKeyDown', EventExpression.Key, EventExpression.ShiftKey],
    },
    {
      name: DomEventListenersFunctions.HandleSubmit,
      params: ['handleSubmit'],
    },
  ])
})

import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const handleDictateClickExpression = `(() => {
  const target = event.target?.closest?.('[name="dictate"]')
  if (!target) {
    return ''
  }
  const SpeechRecognitionClass = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
  const composer = document.querySelector('[name="composer"]')
  if (!SpeechRecognitionClass || !composer || !('value' in composer)) {
    return ''
  }
  const state = globalThis.__chatViewDictationState || (globalThis.__chatViewDictationState = {})
  const existingRecognition = state.recognition
  if (existingRecognition) {
    existingRecognition.stop()
    state.recognition = undefined
    return ''
  }
  const initialValue = typeof composer.value === 'string' ? composer.value : ''
  const prefix = initialValue && !/\\s$/.test(initialValue) ? \`\${initialValue} \` : initialValue
  const updateComposerValue = (nextValue) => {
    composer.value = nextValue
    composer.dispatchEvent(new Event('input', { bubbles: true }))
  }
  const recognition = new SpeechRecognitionClass()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.onresult = (speechEvent) => {
    let transcript = ''
    for (let i = 0; i < speechEvent.results.length; i++) {
      transcript += speechEvent.results[i][0]?.transcript || ''
    }
    updateComposerValue(prefix + transcript)
  }
  const clearRecognition = () => {
    if (state.recognition === recognition) {
      state.recognition = undefined
    }
  }
  recognition.onend = clearRecognition
  recognition.onerror = clearRecognition
  const startRecognition = () => {
    state.recognition = recognition
    recognition.start()
  }
  if (navigator.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop())
        startRecognition()
      })
      .catch(() => {})
    return ''
  }
  startRecognition()
  return ''
})()`

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
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
      name: DomEventListenersFunctions.HandleClickDictationButton,
      params: ['handleClickDictationButton', handleDictateClickExpression],
    },
    {
      name: DomEventListenersFunctions.HandleClickReadFile,
      params: ['handleClickFileName', 'event.target.dataset.uri'],
    },
    {
      name: DomEventListenersFunctions.HandleClickFileName,
      params: ['handleClickFileName', 'event.target.dataset.uri'],
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
      name: DomEventListenersFunctions.HandleSearchInput,
      params: ['handleSearchValueChange', EventExpression.TargetValue],
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
      name: DomEventListenersFunctions.HandleRunModeChange,
      params: ['handleRunModeChange', EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleChatListScroll,
      params: ['handleChatListScroll', 'event.target.scrollTop'],
    },
    {
      name: DomEventListenersFunctions.HandleMessagesScroll,
      params: ['handleMessagesScroll', 'event.target.scrollTop', 'event.target.scrollHeight', 'event.target.clientHeight'],
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
      name: DomEventListenersFunctions.HandleChatWelcomeContextMenu,
      params: ['handleChatDetailWelcomeContextMenu'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleChatHeaderContextMenu,
      params: ['handleChatHeaderContextMenu'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleFocus,
      params: ['handleInputFocus', EventExpression.TargetName],
    },
    {
      name: DomEventListenersFunctions.HandleChatInputContextMenu,
      params: ['handleChatInputContextMenu'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleContextMenuChatSendAreaBottom,
      params: ['handleContextMenuChatSendAreaBottom'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleKeyDown,
      params: ['handleKeyDown', EventExpression.Key, EventExpression.ShiftKey],
    },
    {
      name: DomEventListenersFunctions.HandleSubmit,
      params: ['handleSubmit'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleMissingApiKeySubmit,
      params: ['handleMissingApiKeySubmit', 'event.submitter?.name || ""'],
      preventDefault: true,
    },
  ]
}

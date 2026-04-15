import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenersFunctions.HandleListContextMenu,
      params: ['handleChatListContextMenu', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', EventExpression.TargetName, 'event.target.dataset.id', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleMouseOver,
      params: ['handleMouseOver', EventExpression.TargetName],
    },
    {
      name: DomEventListenersFunctions.HandleMouseOut,
      params: [
        'handleMouseOut',
        EventExpression.TargetName,
        'event.relatedTarget && event.relatedTarget.getAttribute ? event.relatedTarget.getAttribute("name") : ""',
      ],
    },
    {
      name: DomEventListenersFunctions.HandleClickDictationButton,
      params: ['handleClickDictationButton'],
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
      name: DomEventListenersFunctions.HandleClickModelPickerToggle,
      params: ['handleClickModelPickerToggle'],
    },
    {
      name: DomEventListenersFunctions.HandleClickRunModePickerToggle,
      params: ['openRunModePicker'],
    },
    {
      name: DomEventListenersFunctions.HandleClickReasoningEffortPickerToggle,
      params: ['openReasoningEffortPicker'],
    },
    {
      name: DomEventListenersFunctions.HandleClickAgentModePickerToggle,
      params: ['openAgentModePicker'],
    },
    {
      name: DomEventListenersFunctions.HandleClickGitBranchPickerToggle,
      params: ['handleClickGitBranchPickerToggle'],
    },
    {
      name: DomEventListenersFunctions.HandleClickCustomSelectOverlay,
      params: ['handleClickCustomSelectOverlay', EventExpression.DefaultPrevented],
    },
    {
      name: DomEventListenersFunctions.HandleClickModelPickerOverlay,
      params: ['handleClickModelPickerOverlay', EventExpression.DefaultPrevented],
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
      name: DomEventListenersFunctions.HandleComposerSelectionChange,
      params: ['setComposerSelection', EventExpression.TargetSelectionStart, EventExpression.TargetSelectionEnd],
    },
    {
      name: DomEventListenersFunctions.HandleSearchInput,
      params: ['handleSearchValueChange', EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleDragEnter,
      params: ['handleDragEnter', EventExpression.TargetName, EventExpression.DataTransferFiles2],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOver,
      params: ['handleDragOver', EventExpression.TargetName, EventExpression.DataTransferFiles2],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave', EventExpression.TargetName],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDrop,
      params: ['handleDropFiles', EventExpression.TargetName, EventExpression.DataTransferFiles2],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragEnterChatView,
      params: ['handleDragEnter', 'composer-drop-target', EventExpression.DataTransferFiles2],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOverChatView,
      params: ['handleDragOver', 'composer-drop-target', EventExpression.DataTransferFiles2],
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
      name: DomEventListenersFunctions.HandleModelPickerListScroll,
      params: ['handleModelPickerListScroll', 'event.target.scrollTop'],
      passive: true,
    },
    {
      name: DomEventListenersFunctions.HandleProjectAddButtonContextMenu,
      params: ['handleProjectAddButtonContextMenu'],
      preventDefault: true,
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
      params: ['handleChatInputContextMenu', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleContextMenuChatSendAreaBottom,
      params: ['handleContextMenuChatSendAreaBottom'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleContextMenuChatModelPicker,
      params: ['handleContextMenuChatModelPicker'],
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
      name: DomEventListenersFunctions.HandleMissingOpenAiApiKeyFormSubmit,
      params: ['handleMissingOpenAiApiKeyFormSubmit'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleMissingOpenRouterApiKeyFormSubmit,
      params: ['handleMissingOpenRouterApiKeyFormSubmit'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerDownModelPickerList,
      params: ['handlePointerDownModelPickerList'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerDownProjectSidebarSash,
      params: ['handlePointerDownProjectSidebarSash'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerMoveProjectSidebarSash,
      params: ['handlePointerMoveProjectSidebarSash', EventExpression.ClientX],
    },
    {
      name: DomEventListenersFunctions.HandlePointerUpProjectSidebarSash,
      params: ['handlePointerUpProjectSidebarSash', EventExpression.ClientX],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerUpModelPickerList,
      params: ['handlePointerUpModelPickerList', EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleClickModelPickerList,
      params: ['handleClickModelPickerList', EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleModelInputBlur,
      params: ['handleModelInputBlur'],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenuChatImageAttachment,
      params: ['handleContextMenuChatImageAttachment', EventExpression.TargetName, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleErrorComposerAttachmentPreviewOverlay,
      params: ['handleErrorComposerAttachmentPreviewOverlay'],
    },
  ]
}

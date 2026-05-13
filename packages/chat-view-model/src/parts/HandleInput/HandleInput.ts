import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import { setState } from '../ModelState/ModelState.ts'
import type { PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'
import type { ChatModel, ComposerAttachment } from '../ViewModel/ViewModel.ts'

const Composer = 'composer'
const Search = 'search'
const ModelPickerSearch = 'model-picker-search'
const OpenApiApiKeyInput = 'open-api-api-key'
const OpenRouterApiKeyInput = 'open-router-api-key'

const estimateComposerHeight = (value: string, lineHeight: number): number => {
  const lineCount = value.split('\n').length
  return lineCount * lineHeight + 8
}

const getComposerWidth = (width: number): number => {
  return Math.max(1, width - 32)
}

const getMaxComposerHeight = (lineHeight: number, maxComposerRows: number): number => {
  return lineHeight * Math.max(1, maxComposerRows) + 8
}

const getMinComposerHeight = (lineHeight: number): number => {
  return lineHeight + 8
}

const measureTextBlockHeight = async (text: string, fontFamily: string, fontSize: number, lineHeight: string, width: number): Promise<number> => {
  return RendererWorker.measureTextBlockHeight(text, fontFamily, fontSize, lineHeight, width)
}

const getComposerHeight = async (state: HandleInputState, value: string, width = state.width): Promise<number> => {
  const { composerFontFamily, composerFontSize, composerLineHeight, maxComposerRows } = state
  if (value === '') {
    return composerLineHeight
  }
  const minimumHeight = getMinComposerHeight(composerLineHeight)
  const maximumHeight = getMaxComposerHeight(composerLineHeight, maxComposerRows)
  const content = value || ' '
  const composerWidth = getComposerWidth(width)
  try {
    const measuredHeight = await measureTextBlockHeight(content, composerFontFamily, composerFontSize, `${composerLineHeight}px`, composerWidth)
    const height = Math.ceil(measuredHeight)
    return Math.max(minimumHeight, Math.min(maximumHeight, height))
  } catch {
    return Math.max(minimumHeight, Math.min(maximumHeight, estimateComposerHeight(value, composerLineHeight)))
  }
}

const rerender = async (uid: number): Promise<void> => {
  await RendererWorker.invoke('Chat.rerenderWithQuery', uid)
}

export interface HandleInputState extends PrototypeStateBase {
  readonly chatInputHistoryDraft: string
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerAttachmentsHeight: number
  readonly composerFontFamily: string
  readonly composerFontSize: number
  readonly composerHeight: number
  readonly composerLineHeight: number
  readonly composerSelectionEnd: number
  readonly composerSelectionStart: number
  readonly composerValue: string
  readonly inputSource: 'user' | 'script'
  readonly maxComposerRows: number
  readonly modelPickerHeaderHeight: number
  readonly modelPickerHeight: number
  readonly modelPickerListScrollTop: number
  readonly modelPickerSearchValue: string
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
  readonly openRouterApiKeyInput: string
  readonly searchValue: string
  readonly visibleModels: readonly ChatModel[]
  readonly width: number
}

export const getNextState = async (
  state: HandleInputState,
  name: string,
  value: string,
  inputSource: 'user' | 'script' = 'user',
): Promise<HandleInputState> => {
  if (name === OpenApiApiKeyInput) {
    return {
      ...state,
      openApiApiKeyInput: value,
    }
  }
  if (name === OpenRouterApiKeyInput) {
    return {
      ...state,
      openRouterApiKeyInput: value,
    }
  }
  if (name === Search) {
    return {
      ...state,
      searchValue: value,
    }
  }
  if (name === ModelPickerSearch) {
    const visibleModels = getVisibleModels(state.models, value)
    const selectedModelId = visibleModels.some((model) => model.id === state.selectedModelId)
      ? state.selectedModelId
      : visibleModels[0]?.id || state.selectedModelId
    return {
      ...state,
      modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, visibleModels.length),
      modelPickerListScrollTop: 0,
      modelPickerSearchValue: value,
      selectedModelId,
      visibleModels,
    }
  }
  if (name !== Composer) {
    return state
  }
  const composerHeight = await getComposerHeight(state, value)
  const composerAttachmentsHeight = getComposerAttachmentsHeight(state.composerAttachments, state.width)
  const chatInputHistoryDraft = state.chatInputHistoryIndex === -1 ? value : state.chatInputHistoryDraft
  return {
    ...state,
    chatInputHistoryDraft,
    composerAttachmentsHeight,
    composerHeight,
    composerSelectionEnd: value.length,
    composerSelectionStart: value.length,
    composerValue: value,
    inputSource,
  }
}

export const handleInput = async (
  state: HandleInputState,
  name: string,
  value: string,
  inputSource: 'user' | 'script' = 'user',
): Promise<HandleInputState> => {
  // if (name === Composer && state.selectedSessionId) {
  //   await appendChatViewEvent({
  //     sessionId: state.selectedSessionId,
  //     timestamp: new Date().toISOString(),
  //     type: 'handle-input',
  //     value,
  //   })
  // }
  const nextState = await getNextState(state, name, value, inputSource)
  setState(state.uid, nextState)
  await rerender(state.uid)
  return nextState
}

import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PrototypeStateBase } from '../PrototypeState/PrototypeState.ts'
import type { ComposerAttachment } from '../ViewModel/ViewModel.ts'
import { setState } from '../ModelState/ModelState.ts'

export interface HandleClickBackState extends PrototypeStateBase {
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerAttachmentsHeight: number
  readonly lastNormalViewMode: 'list' | 'detail'
  readonly renamingSessionId: string
}

const getNextState = (state: HandleClickBackState): HandleClickBackState => {
  return {
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    lastNormalViewMode: 'list',
    renamingSessionId: '',
    viewMode: 'list',
  }
}

export const handleClickBack = async (state: HandleClickBackState): Promise<HandleClickBackState> => {
  const nextState = getNextState(state)
  setState(state.uid, nextState)
  await RendererWorker.invoke('Chat.rerenderWithQuery', state.uid)
  return nextState
}

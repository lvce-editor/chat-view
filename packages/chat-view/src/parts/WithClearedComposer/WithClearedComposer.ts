import type { ChatState } from '../ChatState/ChatState.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'

export const withClearedComposer = (state: ChatState): ChatState => {
  return FocusInput.focusInput({
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    inputSource: 'script',
  })
}

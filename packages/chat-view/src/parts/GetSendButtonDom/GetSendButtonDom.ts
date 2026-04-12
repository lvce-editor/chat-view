import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { getDictationButtonDom } from '../GetDictationButtonDom/GetDictationButtonDom.ts'
import { getStopButtonDom } from '../GetStopButtonDom/GetStopButtonDom.ts'
import { getSubmitButtonDom } from '../GetSubmitButtonDom/GetSubmitButtonDom.ts'

export const getSendButtonDom = (
  isSendDisabled: boolean,
  voiceDictationEnabled: boolean,
  isSessionInProgress: boolean,
): readonly VirtualDomNode[] => {
  return [
    ...(voiceDictationEnabled ? getDictationButtonDom() : []),
    ...(isSessionInProgress ? getStopButtonDom() : getSubmitButtonDom(isSendDisabled)),
  ]
}

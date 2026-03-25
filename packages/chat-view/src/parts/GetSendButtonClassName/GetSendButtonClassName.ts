import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

 
export const getSendButtonClassName = (isSendDisabled: boolean): string => {
  return mergeClassNames(ClassNames.IconButton, isSendDisabled ? ClassNames.SendButtonDisabled : '')
}

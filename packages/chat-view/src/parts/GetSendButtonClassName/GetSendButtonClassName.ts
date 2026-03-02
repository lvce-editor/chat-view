import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getSendButtonClassName = (isSendDisabled: boolean): string => {
  return isSendDisabled ? `${ClassNames.IconButton} ${ClassNames.SendButtonDisabled}` : `${ClassNames.IconButton}`
}

import * as ClassNames from '../ClassNames/ClassNames.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getSendButtonClassName = (isSendDisabled: boolean): string => {
  return isSendDisabled ? `${ClassNames.IconButton} ${ClassNames.SendButtonDisabled}` : `${ClassNames.IconButton}`
}

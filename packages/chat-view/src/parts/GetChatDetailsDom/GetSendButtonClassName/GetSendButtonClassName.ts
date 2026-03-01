import * as ClassNames from '../../ClassNames/ClassNames.ts'

export const getSendButtonClassName = (isSendDisabled: boolean): string => {
  return isSendDisabled
    ? `${ClassNames.Button} ${ClassNames.ButtonPrimary} ${ClassNames.ButtonDisabled}`
    : `${ClassNames.Button} ${ClassNames.ButtonPrimary}`
}

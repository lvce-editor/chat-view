import * as I18nString from '../I18NString/I18NString.ts'
import * as UiStrings from '../UiStrings/UiStrings.ts'

export const newFile = (): string => {
  return I18nString.i18nString(UiStrings.NewFile)
}

export const newFolder = (): string => {
  return I18nString.i18nString(UiStrings.NewFolder)
}

export const openContainingFolder = (): string => {
  return I18nString.i18nString(UiStrings.OpenContainingFolder)
}

export const openInIntegratedTerminal = (): string => {
  return I18nString.i18nString(UiStrings.OpenInIntegratedTerminal)
}

export const cut = (): string => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = (): string => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = (): string => {
  return I18nString.i18nString(UiStrings.Paste)
}

export const pasteConfirmation = (): string => {
  return I18nString.i18nString(UiStrings.PasteConfirmation)
}

export const copyPath = (): string => {
  return I18nString.i18nString(UiStrings.CopyPath)
}

export const copyRelativePath = (): string => {
  return I18nString.i18nString(UiStrings.CopyRelativePath)
}

export const rename = (): string => {
  return I18nString.i18nString(UiStrings.Rename)
}

export const deleteItem = (): string => {
  return I18nString.i18nString(UiStrings.Delete)
}

export const deleteConfirmationSingle = (path: string): string => {
  return I18nString.i18nString(UiStrings.DeleteConfirmationSingle, [path])
}

export const deleteConfirmationMultiple = (count: number): string => {
  return I18nString.i18nString(UiStrings.DeleteConfirmationMultiple, [count.toString()])
}

export const refresh = (): string => {
  return I18nString.i18nString(UiStrings.RefreshExplorer)
}

export const collapseAll = (): string => {
  return I18nString.i18nString(UiStrings.CollapseAllFoldersInExplorer)
}

export const explorer = (): string => {
  return I18nString.i18nString(UiStrings.Explorer)
}

export const filesExplorer = (): string => {
  return I18nString.i18nString(UiStrings.FilesExplorer)
}

export const youHaveNotYetOpenedAFolder = (): string => {
  return I18nString.i18nString(UiStrings.YouHaveNotYetOpenedAFolder)
}

export const openFolder = (): string => {
  return I18nString.i18nString(UiStrings.OpenFolder)
}

export const noFolderOpen = (): string => {
  return I18nString.i18nString(UiStrings.NoFolderOpen)
}

export const fileOrFolderNameMustBeProvided = (): string => {
  return I18nString.i18nString(UiStrings.FileOrFolderNameMustBeProvider)
}

export const fileCannotStartWithSlash = (): string => {
  return I18nString.i18nString(UiStrings.FileNameCannotStartWithSlash)
}

export const fileCannotStartWithDot = (): string => {
  return I18nString.i18nString(UiStrings.FileCannotStartWithDot)
}

export const fileCannotStartWithBackSlash = (): string => {
  return I18nString.i18nString(UiStrings.FileCannotStartWithBackSlash)
}

export const typeAFileName = (): string => {
  return I18nString.i18nString(UiStrings.TypeAFileName)
}

export const fileNameCannotStartWithSlash = (): string => {
  return I18nString.i18nString(UiStrings.FileNameCannotStartWithSlash)
}

export const fileOrFolderAlreadyExists = (name: string): string => {
  return I18nString.i18nString(UiStrings.FileOrFolderAlreadyExists, {
    PH1: name,
  })
}

export const theNameIsNotValid = (): string => {
  return I18nString.i18nString(UiStrings.TheNameIsNotValid)
}

export const leadingOrTrailingWhitespaceDetected = (): string => {
  return I18nString.i18nString(UiStrings.LeadingOrTrailingWhitespaceDetected)
}

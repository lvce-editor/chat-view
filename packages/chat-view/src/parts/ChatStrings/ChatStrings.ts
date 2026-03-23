import { i18nString } from '@lvce-editor/i18n'
import * as UiStrings from '../UiStrings/UiStrings.ts'

export const chatTitle = (): string => {
  return i18nString('Chat')
}

export const chats = (): string => {
  return i18nString('Chat')
}

export const newChat = (): string => {
  return i18nString('New Chat')
}

export const addProject = (): string => {
  return i18nString('Add Project')
}

export const debug = (): string => {
  return i18nString('Debug')
}

export const backToChats = (): string => {
  return i18nString('Back to chats')
}

export const backToChatList = (): string => {
  return i18nString('Back to chat list')
}

export const settings = (): string => {
  return i18nString('Settings')
}

export const search = (): string => {
  return i18nString('Search')
}

export const searchChats = (): string => {
  return i18nString('Search chats')
}

export const login = (): string => {
  return i18nString('Login')
}

export const logout = (): string => {
  return i18nString('Logout')
}

export const loginToBackend = (): string => {
  return i18nString('Login to backend')
}

export const logoutFromBackend = (): string => {
  return i18nString('Logout from backend')
}

export const loggingInToBackend = (): string => {
  return i18nString('Logging in to backend')
}

export const chatFocusMode = (): string => {
  return i18nString('Switch to chat focus mode')
}

export const normalChatMode = (): string => {
  return i18nString('Switch to normal chat mode')
}

export const closeChat = (): string => {
  return i18nString('Close Chat')
}

export const clickToOpenNewChat = (): string => {
  return i18nString('Click the + button to open a new chat.')
}

export const startConversation = (): string => {
  return i18nString('Start a conversation by typing below.')
}

export const noMatchingModelsFound = (): string => {
  return i18nString('No matching models have been found.')
}

export const you = (): string => {
  return i18nString('You')
}

export const assistant = (): string => {
  return i18nString('Assistant')
}

export const composePlaceholder = (): string => {
  return i18nString('Type your message. Enter to send.')
}

export const attachImageAsContext = (): string => {
  return i18nString('Attach Image as Context')
}

export const openRouterApiKeyPlaceholder = (): string => {
  return i18nString('Enter OpenRouter API key')
}

export const openApiApiKeyPlaceholder = (): string => {
  return i18nString('Enter OpenAI API key')
}

export const sendMessage = (): string => {
  return i18nString('Send message')
}

export const startVoiceDictation = (): string => {
  return i18nString('Start voice dictation')
}

export const addContext = (): string => {
  return i18nString('Add Context')
}

export const send = (): string => {
  return i18nString('Send')
}

export const save = (): string => {
  return i18nString('Save')
}

export const saving = (): string => {
  return i18nString('Saving...')
}

export const working = (): string => {
  return i18nString('Working')
}

export const getOpenRouterApiKey = (): string => {
  return i18nString('Get API Key')
}

export const getOpenApiApiKey = (): string => {
  return i18nString('Get API Key')
}

export const deleteChatSession = (): string => {
  return i18nString('Archive')
}

export const defaultSessionTitle = (): string => {
  return i18nString('Chat 1')
}

export const dummyChatA = (): string => {
  return i18nString('Dummy Chat A')
}

export const dummyChatB = (): string => {
  return i18nString('Dummy Chat B')
}

export const dummyChatC = (): string => {
  return i18nString('Dummy Chat C')
}

export const unknownViewMode = (): string => {
  return i18nString('Unknown view mode')
}

export const newFile = (): string => {
  return i18nString(UiStrings.NewFile)
}

export const newFolder = (): string => {
  return i18nString(UiStrings.NewFolder)
}

export const openContainingFolder = (): string => {
  return i18nString(UiStrings.OpenContainingFolder)
}

export const openInIntegratedTerminal = (): string => {
  return i18nString(UiStrings.OpenInIntegratedTerminal)
}

export const cut = (): string => {
  return i18nString(UiStrings.Cut)
}

export const showIcons = (): string => {
  return i18nString(UiStrings.ShowIcon)
}

export const copy = (): string => {
  return i18nString(UiStrings.Copy)
}

export const paste = (): string => {
  return i18nString(UiStrings.Paste)
}

export const pasteConfirmation = (): string => {
  return i18nString(UiStrings.PasteConfirmation)
}

export const copyPath = (): string => {
  return i18nString(UiStrings.CopyPath)
}

export const copyAsE2eTest = (): string => {
  return i18nString(UiStrings.CopyAsE2eTest)
}

export const copyRelativePath = (): string => {
  return i18nString(UiStrings.CopyRelativePath)
}

export const rename = (): string => {
  return i18nString(UiStrings.Rename)
}
export const archive = (): string => {
  return i18nString(UiStrings.Archive)
}

export const deleteItem = (): string => {
  return i18nString(UiStrings.Delete)
}

export const deleteConfirmationSingle = (path: string): string => {
  return i18nString(UiStrings.DeleteConfirmationSingle, [path])
}

export const deleteConfirmationMultiple = (count: number): string => {
  return i18nString(UiStrings.DeleteConfirmationMultiple, [count.toString()])
}

export const refresh = (): string => {
  return i18nString(UiStrings.RefreshExplorer)
}

export const collapseAll = (): string => {
  return i18nString(UiStrings.CollapseAllFoldersInExplorer)
}

export const explorer = (): string => {
  return i18nString(UiStrings.Explorer)
}

export const filesExplorer = (): string => {
  return i18nString(UiStrings.FilesExplorer)
}

export const youHaveNotYetOpenedAFolder = (): string => {
  return i18nString(UiStrings.YouHaveNotYetOpenedAFolder)
}

export const openFolder = (): string => {
  return i18nString(UiStrings.OpenFolder)
}

export const noFolderOpen = (): string => {
  return i18nString(UiStrings.NoFolderOpen)
}

export const fileOrFolderNameMustBeProvided = (): string => {
  return i18nString(UiStrings.FileOrFolderNameMustBeProvider)
}

export const fileCannotStartWithSlash = (): string => {
  return i18nString(UiStrings.FileNameCannotStartWithSlash)
}

export const fileCannotStartWithDot = (): string => {
  return i18nString(UiStrings.FileCannotStartWithDot)
}

export const fileCannotStartWithBackSlash = (): string => {
  return i18nString(UiStrings.FileCannotStartWithBackSlash)
}

export const typeAFileName = (): string => {
  return i18nString(UiStrings.TypeAFileName)
}

export const fileNameCannotStartWithSlash = (): string => {
  return i18nString(UiStrings.FileNameCannotStartWithSlash)
}

export const fileOrFolderAlreadyExists = (name: string): string => {
  return i18nString(UiStrings.FileOrFolderAlreadyExists, {
    PH1: name,
  })
}

export const theNameIsNotValid = (): string => {
  return i18nString(UiStrings.TheNameIsNotValid)
}

export const leadingOrTrailingWhitespaceDetected = (): string => {
  return i18nString(UiStrings.LeadingOrTrailingWhitespaceDetected)
}

export const openApiApiKeyRequiredMessage = i18nString('OpenAI API key is not configured. Enter your OpenAI API key below and click Save.')

export const openApiRequestFailedMessage = i18nString('OpenAI request failed.')

export const openApiRequestFailedOfflineMessage = i18nString('OpenAI request failed because you are offline. Please check your internet connection.')

export const openRouterApiKeyRequiredMessage = i18nString('OpenRouter API key is not configured. Enter your OpenRouter API key below and click Save.')

export const openRouterRequestFailedMessage = i18nString('OpenRouter request failed. Possible reasons:')

export const openRouterTooManyRequestsMessage = i18nString('OpenRouter rate limit reached (429). Please try again soon. Helpful tips:')

export const openRouterRequestFailureReasons = [
  i18nString('ContentSecurityPolicyViolation: Check DevTools for details.'),
  i18nString('OpenRouter server offline: Check DevTools for details.'),
  i18nString('Check your internet connection.'),
] as const

export const openRouterTooManyRequestsReasons = [
  i18nString('Wait a short time and retry your request.'),
  i18nString('Reduce request frequency to avoid rate limits.'),
  i18nString('Use a different model if this one is saturated.'),
] as const

export const backendUrlRequiredMessage = i18nString('Backend URL is not configured. Configure your backend URL and try again.')

export const backendAccessTokenRequiredMessage = i18nString('You are not logged in. Click Login to continue.')

export const backendCompletionFailedMessage = i18nString('Backend completion request failed.')

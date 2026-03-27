import { expect, test } from '@jest/globals'
import * as ChatStrings from '../src/parts/ChatStrings/ChatStrings.ts'

const zeroArgCases = [
  ['chatTitle', 'Chat'],
  ['chats', 'Chat'],
  ['newChat', 'New Chat'],
  ['addProject', 'Add Project'],
  ['debug', 'Debug'],
  ['backToChats', 'Back to chats'],
  ['backToChatList', 'Back to chat list'],
  ['settings', 'Settings'],
  ['search', 'Search'],
  ['searchModels', 'Search models'],
  ['searchChats', 'Search chats'],
  ['login', 'Login'],
  ['logout', 'Logout'],
  ['loginToBackend', 'Login to backend'],
  ['logoutFromBackend', 'Logout from backend'],
  ['loggingInToBackend', 'Logging in to backend'],
  ['chatFocusMode', 'Switch to chat focus mode'],
  ['normalChatMode', 'Switch to normal chat mode'],
  ['closeChat', 'Close Chat'],
  ['clickToOpenNewChat', 'Click the + button to open a new chat.'],
  ['startConversation', 'Start a conversation by typing below.'],
  ['noMatchingModelsFound', 'No matching models have been found.'],
  ['you', 'You'],
  ['assistant', 'Assistant'],
  ['composePlaceholder', 'Type your message. Enter to send.'],
  ['attachImageAsContext', 'Attach Image as Context'],
  ['removeAttachment', 'Remove attachment'],
  ['openRouterApiKeyPlaceholder', 'Enter OpenRouter API key'],
  ['openApiApiKeyPlaceholder', 'Enter OpenAI API key'],
  ['sendMessage', 'Send message'],
  ['startVoiceDictation', 'Start voice dictation'],
  ['addContext', 'Add Context'],
  ['addAction', 'Add Action'],
  ['openInVsCode', 'Open in VSCode'],
  ['commit', 'Commit'],
  ['openTerminal', 'Open Terminal'],
  ['showDiff', 'Show Diff'],
  ['send', 'Send'],
  ['save', 'Save'],
  ['saving', 'Saving...'],
  ['working', 'Working'],
  ['getOpenRouterApiKey', 'Get API Key'],
  ['getOpenApiApiKey', 'Get API Key'],
  ['deleteChatSession', 'Archive'],
  ['defaultSessionTitle', 'Chat 1'],
  ['dummyChatA', 'Dummy Chat A'],
  ['dummyChatB', 'Dummy Chat B'],
  ['dummyChatC', 'Dummy Chat C'],
  ['unknownViewMode', 'Unknown view mode'],
  ['newFile', 'New File...'],
  ['newFolder', 'New Folder...'],
  ['openContainingFolder', 'Open Containing Folder'],
  ['openInIntegratedTerminal', 'Open in integrated Terminal'],
  ['cut', 'Cut'],
  ['showIcons', 'Show Icons'],
  ['copy', 'Copy'],
  ['paste', 'Paste'],
  ['pasteConfirmation', 'Are you sure you want to paste these files?'],
  ['copyPath', 'Copy Path'],
  ['copyAsE2eTest', 'Copy as E2E Test'],
  ['copyRelativePath', 'Copy Relative Path'],
  ['rename', 'Rename'],
  ['archive', 'Archive'],
  ['deleteItem', 'Delete'],
  ['refresh', 'Refresh Explorer'],
  ['collapseAll', 'Collapse All Folders in Explorer'],
  ['explorer', 'Explorer'],
  ['filesExplorer', 'Files Explorer'],
  ['youHaveNotYetOpenedAFolder', 'You have not yet opened a folder.'],
  ['openFolder', 'Open folder'],
  ['noFolderOpen', 'No Folder Open'],
  ['fileOrFolderNameMustBeProvided', 'A file or folder name must be provided.'],
  ['fileCannotStartWithSlash', 'A file or folder name cannot start with a slash.'],
  ['fileCannotStartWithDot', 'A file or folder name cannot start with a dot.'],
  ['fileCannotStartWithBackSlash', 'A file or folder name cannot start with a backslash.'],
  ['typeAFileName', 'Type file name. Press Enter to confirm or Escape to cancel.'],
  ['fileNameCannotStartWithSlash', 'A file or folder name cannot start with a slash.'],
  ['theNameIsNotValid', 'The name **{0}** is not valid as a file or folder name. Please choose a different name.'],
  ['leadingOrTrailingWhitespaceDetected', 'Leading or trailing whitespace detected in file or folder name.'],
] as const

test.each(zeroArgCases)('%s should return expected text', (name, expected) => {
  const result = ChatStrings[name]()
  expect(result).toBe(expected)
})

test('deleteConfirmationSingle should preserve positional placeholder', () => {
  expect(ChatStrings.deleteConfirmationSingle('src/app.ts')).toBe('Are you sure you want to delete "{0}"?')
})

test('deleteConfirmationSingle should return the same template for different inputs', () => {
  expect(ChatStrings.deleteConfirmationSingle('  notes.txt  ')).toBe('Are you sure you want to delete "{0}"?')
})

test('deleteConfirmationMultiple should preserve positional placeholder for numeric count', () => {
  expect(ChatStrings.deleteConfirmationMultiple(3)).toBe('Are you sure you want to delete {0} items?')
})

test('deleteConfirmationMultiple should preserve positional placeholder for zero count', () => {
  expect(ChatStrings.deleteConfirmationMultiple(0)).toBe('Are you sure you want to delete {0} items?')
})

test('fileOrFolderAlreadyExists should insert placeholder value', () => {
  expect(ChatStrings.fileOrFolderAlreadyExists('readme.md')).toBe(
    'A file or folder **readme.md** already exists at this location. Please choose a different name.',
  )
})

test('openApi and openRouter key-required messages should match expected copy', () => {
  expect(ChatStrings.openApiApiKeyRequiredMessage).toBe('OpenAI API key is not configured. Enter your OpenAI API key below and click Save.')
  expect(ChatStrings.openRouterApiKeyRequiredMessage).toBe(
    'OpenRouter API key is not configured. Enter your OpenRouter API key below and click Save.',
  )
})

test('request failed messages should match expected copy', () => {
  expect(ChatStrings.openApiRequestFailedMessage).toBe('OpenAI request failed.')
  expect(ChatStrings.openApiRequestFailedOfflineMessage).toBe('OpenAI request failed because you are offline. Please check your internet connection.')
  expect(ChatStrings.openRouterRequestFailedMessage).toBe('OpenRouter request failed. Possible reasons:')
})

test('openRouter too many requests message should match expected copy', () => {
  expect(ChatStrings.openRouterTooManyRequestsMessage).toBe('OpenRouter rate limit reached (429). Please try again soon. Helpful tips:')
})

test('openRouterRequestFailureReasons should list all expected reasons in order', () => {
  expect(ChatStrings.openRouterRequestFailureReasons).toEqual([
    'ContentSecurityPolicyViolation: Check DevTools for details.',
    'OpenRouter server offline: Check DevTools for details.',
    'Check your internet connection.',
  ])
})

test('openRouterTooManyRequestsReasons should list all expected tips in order', () => {
  expect(ChatStrings.openRouterTooManyRequestsReasons).toEqual([
    'Wait a short time and retry your request.',
    'Reduce request frequency to avoid rate limits.',
    'Use a different model if this one is saturated.',
  ])
})

test('backend messages should match expected copy', () => {
  expect(ChatStrings.backendUrlRequiredMessage).toBe('Backend URL is not configured. Configure your backend URL and try again.')
  expect(ChatStrings.backendAccessTokenRequiredMessage).toBe('You are not logged in. Click Login to continue.')
  expect(ChatStrings.backendCompletionFailedMessage).toBe('Backend completion request failed.')
})

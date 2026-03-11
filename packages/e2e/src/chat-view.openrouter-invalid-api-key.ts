// cspell:ignore openrouter
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openrouter-invalid-api-key'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Command.execute('Chat.setOpenRouterApiKey', 'or-invalid-key-for-e2e', false)
  await Chat.handleModelChange('openRouter/meta-llama/llama-3.3-70b-instruct:free')
  await Chat.handleInput('hello from e2e')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('hello from e2e')

  const secondMessage = messages.nth(1)
  await expect(secondMessage).toContainText('OpenRouter request failed. Possible reasons:')
  await expect(secondMessage).toContainText('ContentSecurityPolicyViolation: Check DevTools for details.')
  await expect(secondMessage).toContainText('OpenRouter server offline: Check DevTools for details.')
  await expect(secondMessage).toContainText('Check your internet connection.')
}

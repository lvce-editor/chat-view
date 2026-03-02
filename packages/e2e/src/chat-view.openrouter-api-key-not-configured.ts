/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openrouter-api-key-not-configured'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')

  await Command.execute('Chat.handleModelChange', 'openRouter/meta-llama/llama-3.3-70b-instruct:free')
  await Command.execute('Chat.handleInput', 'hello from e2e', 'script')
  await Command.execute('Chat.handleSubmit')

  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenRouter API key is not configured')
}

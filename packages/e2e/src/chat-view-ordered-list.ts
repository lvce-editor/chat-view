import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.ordered-list'

export const test: Test = async ({ Chat, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.handleInput('what tools do you have access to?')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('what tools do you have access to?')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText(
    `I have access to the following tools: 1. functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI. 2. functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder. 3. functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder. I can also use these tools in parallel when appropriate. If you want me to perform any file operations or check files/folders, just let me know!`,
  )
}

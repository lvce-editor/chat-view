import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.unordered-list'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  const mockText = `The purpose of life is a deeply philosophical and personal question that varies from person to person. Many perspectives exist:

- Some find purpose through relationships, love, and connection with others. - Others seek meaning in personal growth, knowledge, and self-improvement. - Many find purpose through contributing to society, helping others, or creating something lasting. - Spiritual and religious beliefs often provide purpose through understanding existence, serving a higher power, or following moral principles. - Some believe life’s purpose is to find happiness and fulfillment in the present moment.

Ultimately, the purpose of life is something each individual defines for themselves through their experiences, values, and beliefs. If you'd like, I can share different philosophical or cultural perspectives on life’s purpose or help you explore your own purpose.`
  await Chat.show()
  await Chat.reset()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockText })
  await Chat.handleInput('purpose of life?')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const firstMessage = messages.nth(0)
  await expect(firstMessage).toHaveText('purpose of life?')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText(
    `The purpose of life is a deeply philosophical and personal question that varies from person to person. Many perspectives exist:

- Some find purpose through relationships, love, and connection with others. - Others seek meaning in personal growth, knowledge, and self-improvement. - Many find purpose through contributing to society, helping others, or creating something lasting. - Spiritual and religious beliefs often provide purpose through understanding existence, serving a higher power, or following moral principles. - Some believe life’s purpose is to find happiness and fulfillment in the present moment.

Ultimately, the purpose of life is something each individual defines for themselves through their experiences, values, and beliefs. If you'd like, I can share different philosophical or cultural perspectives on life’s purpose or help you explore your own purpose.`,
  )
}

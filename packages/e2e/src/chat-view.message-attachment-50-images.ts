import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.message-attachment-50-images'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
const svgPreviewSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg=='

const createImageFiles = (count: number): readonly File[] => {
  return Array.from({ length: count }, (_, index) => new File([svgContent], `photo-${index + 1}.svg`, { type: 'image/svg+xml' }))
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Command.execute('Chat.openMockSession', 'session-message-attachment-50-images', [])
  await Chat.handleModelChange('openapi/gpt-4o-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('__MOCK_OPENAPI_LAST_REQUEST_SUMMARY__')
  await Chat.mockOpenApiStreamFinish()

  const files = createImageFiles(50)

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', files)
  await Chat.handleInput('Please review these images')
  await Chat.handleSubmit()

  const userMessages = Locator('.ChatMessages .MessageUser')
  const textMessage = userMessages.first()
  const imageMessageContents = Locator('.ChatMessages .MessageUser .ChatMessageContent.ChatImageMessageContent')
  const images = Locator('.ChatMessages .MessageUser .ChatMessageImage')

  await expect(userMessages).toHaveCount(51)
  await expect(textMessage).toHaveText('Please review these images')
  await expect(imageMessageContents).toHaveCount(50)
  await expect(images).toHaveCount(50)
  await expect(images.first()).toHaveAttribute('alt', 'photo-1.svg')
  await expect(images.first()).toHaveAttribute('src', svgPreviewSrc)
  await expect(images.nth(49)).toHaveAttribute('alt', 'photo-50.svg')
  await expect(images.nth(49)).toHaveAttribute('src', svgPreviewSrc)
}

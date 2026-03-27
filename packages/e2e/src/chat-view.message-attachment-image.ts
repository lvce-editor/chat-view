import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.message-attachment-image'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
const svgPreviewSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg=='

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Command.execute('Chat.openMockSession', 'session-message-attachment-image', [])
  await Chat.handleModelChange('openapi/gpt-4o-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('__MOCK_OPENAPI_LAST_REQUEST_SUMMARY__')
  await Chat.mockOpenApiStreamFinish()

  const file = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [file])
  await Chat.handleInput('Please review this image')
  await Chat.handleSubmit()

  const userMessage = Locator('.ChatMessages .MessageUser').first()
  const attachments = userMessage.locator('.ChatAttachments')
  const attachment = userMessage.locator('.ChatAttachment')
  const preview = userMessage.locator('.ChatAttachmentPreview')

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(1)
  await expect(attachment.first()).toHaveText('Image · photo.svg')
  await expect(preview).toHaveCount(1)
  await expect(preview).toHaveAttribute('src', svgPreviewSrc)
}

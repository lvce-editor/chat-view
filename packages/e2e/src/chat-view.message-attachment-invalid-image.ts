import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.message-attachment-invalid-image'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Command.execute('Chat.openMockSession', 'session-message-attachment-invalid-image', [])
  await Chat.handleModelChange('openapi/gpt-4o-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('__MOCK_OPENAPI_LAST_REQUEST_SUMMARY__')
  await Chat.mockOpenApiStreamFinish()

  const file = new File(['not-a-real-png'], 'broken.png', { type: 'image/png' })

  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', [file])
  await Chat.handleInput('Please review this image')
  await Chat.handleSubmit()

  const userMessage = Locator('.ChatMessages .MessageUser').first()
  const attachments = userMessage.locator('.ChatAttachments')
  const attachment = userMessage.locator('.ChatAttachment')
  const preview = userMessage.locator('.ChatAttachmentPreview')

  await expect(attachments).toBeVisible()
  await expect(attachment).toHaveCount(1)
  await expect(attachment.first()).toHaveText('Invalid image · broken.png')
  await expect(preview).toHaveCount(0)
}

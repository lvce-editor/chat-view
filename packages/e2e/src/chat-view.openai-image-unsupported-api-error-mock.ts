import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-image-unsupported-api-error-mock'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.openMockSession('session-openai-image-unsupported-api-error-mock', [])
  await Chat.handleModelChange('openapi/gpt-4o-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await Chat.mockOpenApiRequestReset()
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'unsupported_parameter',
      message: 'This model does not support image input.',
      type: 'invalid_request_error',
    },
  })

  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })
  // @ts-ignore
  await Chat.handleDropFiles(imageFile)
  await Chat.handleInput('Describe this image')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(2)).toContainText('does not support image attachments')
  await expect(messages.nth(2)).toContainText('Choose a vision-capable model like GPT-4o Mini or GPT-4o')
}

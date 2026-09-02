import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-image-attachments-payload-mock'

const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'

export const test: Test = async ({ Chat, Command, DragAndDrop, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.openMockSession('session-openai-image-attachments-payload-mock', [])
  await Chat.handleModelChange('openapi/gpt-4o-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('__MOCK_OPENAPI_LAST_REQUEST_SUMMARY__')
  await Chat.mockOpenApiStreamFinish()

  const imageFile = new File([svgContent], 'photo.svg', { type: 'image/svg+xml' })
  const textFile = new File(['hello from text file'], 'notes.txt', { type: 'text/plain' })

  const dropId = await DragAndDrop.createDropSession([
    { file: imageFile, kind: 'file', type: imageFile.type },
    { file: textFile, kind: 'file', type: textFile.type },
  ])
  await Command.execute('Chat.handleDropFiles', 'composer-drop-target', dropId)
  await Chat.handleInput('Please review the attachments')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  const message2 = messages.nth(2)
  await expect(message2).toHaveText('mock-request-summary images=1 text-files=1')
}

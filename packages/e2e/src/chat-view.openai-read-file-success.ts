import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-read-file-success'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'notes.txt'
  const fileContent = 'alpha line\nbeta line\n'
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, fileContent)
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  await Chat.mockOpenApiStreamPushChunk(
    JSON.stringify({
      created_at: 1,
      id: 'resp_01',
      model: 'gpt-4.1-mini-2025-04-14',
      object: 'response',
      output: [
        {
          arguments: JSON.stringify({ path: fileName }),
          call_id: 'call_01',
          id: 'fc_01',
          name: 'read_file',
          status: 'completed',
          type: 'function_call',
        },
      ],
      status: 'completed',
    }),
  )
  await Chat.mockOpenApiStreamPushChunk(
    JSON.stringify({
      created_at: 2,
      id: 'resp_02',
      model: 'gpt-4.1-mini-2025-04-14',
      object: 'response',
      output: [
        {
          content: [
            {
              text: 'The first line is "alpha line" and the file has two lines of text.',
              type: 'output_text',
            },
          ],
          id: 'msg_01',
          role: 'assistant',
          status: 'completed',
          type: 'message',
        },
      ],
      status: 'completed',
    }),
  )
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('Read notes.txt and tell me the first line.')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText('Read notes.txt and tell me the first line.')
  const message1 = messages.nth(1)
  await expect(message1).toContainText(`read_file ${fileName}`)
  await expect(message1).toContainText('The first line is "alpha line" and the file has two lines of text.')
}

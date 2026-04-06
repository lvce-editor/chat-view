import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-ask-question-tool-call-mock'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  const longQuestion =
    'This is a really long question that should still be rendered correctly in the chat UI even when it spans far beyond typical question lengths and contains enough text to validate wrapping and overflow handling.'
  const longAnswer =
    'A very long answer option that should still be visible and styled correctly even when the answer text is much longer than regular short options.'

  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.setQuestionToolEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const sseResponseParts = [
    {
      item: {
        arguments: JSON.stringify({
          answers: ['Yes', 'No', 'Later', 'Never'],
          question: '',
        }),
        call_id: 'call_01',
        id: 'fc_01',
        name: 'ask_question',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 0,
      sequence_number: 0,
      type: 'response.output_item.added',
    },
    {
      item: {
        arguments: JSON.stringify({
          answers: [],
          question: 'Which environment should be used?',
        }),
        call_id: 'call_02',
        id: 'fc_02',
        name: 'ask_question',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 1,
      sequence_number: 1,
      type: 'response.output_item.added',
    },
    {
      item: {
        arguments: JSON.stringify({
          answers: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          question: longQuestion,
        }),
        call_id: 'call_03',
        id: 'fc_03',
        name: 'ask_question',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 2,
      sequence_number: 2,
      type: 'response.output_item.added',
    },
    {
      item: {
        arguments: JSON.stringify({
          answers: [longAnswer, `${longAnswer} (second)`, `${longAnswer} (third)`, `${longAnswer} (fourth)`],
          question: 'Pick one long answer',
        }),
        call_id: 'call_04',
        id: 'fc_04',
        name: 'ask_question',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 3,
      sequence_number: 3,
      type: 'response.output_item.added',
    },
    {
      item: {
        arguments: JSON.stringify({
          answers: ['', 'valid answer'],
          question: 'Edge case with empty answer',
        }),
        call_id: 'call_05',
        id: 'fc_05',
        name: 'ask_question',
        status: 'completed',
        type: 'function_call',
      },
      output_index: 4,
      sequence_number: 4,
      type: 'response.output_item.added',
    },
    {
      response: {
        created_at: 1,
        id: 'resp_01',
        model: 'gpt-4.1-mini-2025-04-14',
        object: 'response',
        output: [],
        status: 'completed',
      },
      sequence_number: 5,
      type: 'response.completed',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('ask me questions')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('ask_question: (empty question)')
  await expect(messages.nth(1)).toContainText('ask_question: Which environment should be used?')
  await expect(messages.nth(1)).toContainText('(no answers)')
  await expect(messages.nth(1)).toContainText(longQuestion)
  await expect(messages.nth(1)).toContainText(longAnswer)
  await expect(messages.nth(1)).toContainText('(empty answer)')
}

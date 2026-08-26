import { expect, test } from '@jest/globals'
import { getChatMessageOpenAiContent } from '../src/parts/GetChatMessageOpenAiContent/GetChatMessageOpenAiContent.ts'

test('getChatMessageOpenAiContent should return plain text when no attachments exist', () => {
  const result = getChatMessageOpenAiContent({
    id: 'message-1',
    role: 'user',
    text: 'hello',
    time: '10:00',
  })

  expect(result).toEqual([
    {
      text: 'hello',
      type: 'input_text',
    },
  ])
})

test('getChatMessageOpenAiContent should return output_text for assistant messages', () => {
  const result = getChatMessageOpenAiContent({
    id: 'message-1',
    role: 'assistant',
    text: 'hello back',
    time: '10:00',
  })

  expect(result).toEqual([
    {
      text: 'hello back',
      type: 'output_text',
    },
  ])
})

test('getChatMessageOpenAiContent should include image and text file attachments', () => {
  const result = getChatMessageOpenAiContent({
    attachments: [
      {
        attachmentId: 'attachment-1',
        displayType: 'image',
        mimeType: 'image/svg+xml',
        name: 'photo.svg',
        previewSrc: 'data:image/svg+xml;base64,abc',
        size: 100,
      },
      {
        attachmentId: 'attachment-2',
        displayType: 'text-file',
        mimeType: 'text/plain',
        name: 'notes.txt',
        size: 12,
        textContent: 'hello from file',
      },
    ],
    id: 'message-1',
    role: 'user',
    text: 'Please review these attachments',
    time: '10:00',
  })

  expect(result).toEqual([
    {
      text: 'Please review these attachments',
      type: 'input_text',
    },
    {
      image_url: 'data:image/svg+xml;base64,abc',
      type: 'input_image',
    },
    {
      text: 'Attached text file "notes.txt" (text/plain):\n\nhello from file',
      type: 'input_text',
    },
  ])
})

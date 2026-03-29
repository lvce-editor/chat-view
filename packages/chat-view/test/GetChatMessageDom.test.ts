import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { openApiApiKeyRequiredMessage } from '../src/parts/ChatStrings/ChatStrings.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getChatMessageDom } from '../src/parts/GetChatMessageDom/GetChatMessageDom.ts'

test('getChatMessageDom should render user attachments below the message content', () => {
  const result = getChatMessageDom(
    {
      attachments: [
        {
          attachmentId: 'attachment-1',
          displayType: 'image',
          mimeType: 'image/svg+xml',
          name: 'photo.svg',
          previewSrc: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==',
          size: 77,
        },
        {
          attachmentId: 'attachment-2',
          displayType: 'text-file',
          mimeType: 'text/plain',
          name: 'notes.txt',
          size: 21,
          textContent: 'hello',
        },
      ],
      id: 'message-1',
      role: 'user',
      text: 'Please review these attachments',
      time: '10:00',
    },
    [
      {
        children: [
          {
            text: 'Please review these attachments',
            type: 'text',
          },
        ],
        type: 'text',
      },
    ],
    '',
  )

  expect(result).toEqual([
    {
      childCount: 1,
      className: `${ClassNames.Message} ${ClassNames.MessageUser}`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    expect.objectContaining({
      className: ClassNames.Markdown,
      type: VirtualDomElements.P,
    }),
    expect.objectContaining({
      text: 'Please review these attachments',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 2,
      className: ClassNames.ChatAttachments,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: `${ClassNames.ChatAttachment} ${ClassNames.ChatAttachmentImage}`,
      type: VirtualDomElements.Div,
    },
    {
      alt: 'Attachment preview for photo.svg',
      childCount: 0,
      className: ClassNames.ChatAttachmentPreview,
      src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==',
      type: VirtualDomElements.Img,
    },
    {
      childCount: 1,
      className: ClassNames.ChatAttachmentLabel,
      type: VirtualDomElements.Span,
    },
    {
      text: 'Image · photo.svg',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: `${ClassNames.ChatAttachment} ${ClassNames.ChatAttachmentTextFile}`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatAttachmentLabel,
      type: VirtualDomElements.Span,
    },
    {
      text: 'Text file · notes.txt',
      type: VirtualDomElements.Text,
    },
  ])
})

test('getChatMessageDom should not render attachment markup for assistant messages', () => {
  const result = getChatMessageDom(
    {
      attachments: [
        {
          attachmentId: 'attachment-1',
          displayType: 'image',
          mimeType: 'image/svg+xml',
          name: 'photo.svg',
          previewSrc: 'data:image/svg+xml;base64,abc',
          size: 77,
        },
      ],
      id: 'message-1',
      role: 'assistant',
      text: 'Thanks',
      time: '10:00',
    },
    [
      {
        children: [
          {
            text: 'Thanks',
            type: 'text',
          },
        ],
        type: 'text',
      },
    ],
    '',
  )

  expect(result).not.toContainEqual(
    expect.objectContaining({
      className: ClassNames.ChatAttachments,
    }),
  )
})

test('getChatMessageDom should mark invalid openai api key input with InputInvalid class', () => {
  const result = getChatMessageDom(
    {
      id: 'message-1',
      role: 'assistant',
      text: openApiApiKeyRequiredMessage,
      time: '10:00',
    },
    [
      {
        children: [
          {
            text: openApiApiKeyRequiredMessage,
            type: 'text',
          },
        ],
        type: 'text',
      },
    ],
    '',
    'invalid-key',
  )

  expect(result).toContainEqual(
    expect.objectContaining({
      className: `${ClassNames.InputBox} ${ClassNames.InputInvalid}`,
      name: 'open-api-api-key',
      pattern: '^sk-.+',
      required: false,
      type: VirtualDomElements.Input,
    }),
  )
})

test('getChatMessageDom should allow empty openai api key input without InputInvalid class', () => {
  const result = getChatMessageDom(
    {
      id: 'message-1',
      role: 'assistant',
      text: openApiApiKeyRequiredMessage,
      time: '10:00',
    },
    [
      {
        children: [
          {
            text: openApiApiKeyRequiredMessage,
            type: 'text',
          },
        ],
        type: 'text',
      },
    ],
    '',
    '',
  )

  expect(result).toContainEqual(
    expect.objectContaining({
      className: ClassNames.InputBox,
      name: 'open-api-api-key',
      pattern: '^sk-.+',
      required: false,
      type: VirtualDomElements.Input,
    }),
  )
  expect(result).not.toContainEqual(
    expect.objectContaining({
      className: `${ClassNames.InputBox} ${ClassNames.InputInvalid}`,
      name: 'open-api-api-key',
    }),
  )
})

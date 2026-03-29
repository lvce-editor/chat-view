import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getMessagesDom } from '../src/parts/GetMessagesDom/GetMessagesDom.ts'

test('getMessagesDom should render submitted images as a separate user message below the text message', () => {
  const result = getMessagesDom(
    [
      {
        attachments: [
          {
            attachmentId: 'attachment-1',
            displayType: 'image',
            mimeType: 'image/png',
            name: 'amp.png',
            previewSrc: 'data:image/png;base64,abc',
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
        text: 'whats in this image',
        time: '10:00',
      },
    ],
    [
      {
        id: 'message-1',
        parsedContent: [
          {
            children: [
              {
                text: 'whats in this image',
                type: 'text',
              },
            ],
            type: 'text',
          },
        ],
        text: 'whats in this image',
      },
    ],
    '',
  )

  expect(result[0]).toEqual({
    childCount: 2,
    className: 'ChatMessages',
    onContextMenu: expect.any(Number),
    onScroll: expect.any(Number),
    role: 'log',
    scrollTop: 0,
    type: VirtualDomElements.Div,
  })
  expect(result.filter((node) => node.className === `${ClassNames.Message} ${ClassNames.MessageUser}`)).toHaveLength(2)
  expect(result).toContainEqual(
    expect.objectContaining({
      className: `${ClassNames.ChatMessageContent} ${ClassNames.ChatImageMessageContent}`,
      type: VirtualDomElements.Div,
    }),
  )
  expect(result).toContainEqual(
    expect.objectContaining({
      className: ClassNames.ChatMessageImage,
      src: 'data:image/png;base64,abc',
      type: VirtualDomElements.Img,
    }),
  )
  expect(result).toContainEqual(
    expect.objectContaining({
      text: 'Text file · notes.txt',
      type: VirtualDomElements.Text,
    }),
  )
  expect(result).not.toContainEqual(
    expect.objectContaining({
      text: 'Image · amp.png',
      type: VirtualDomElements.Text,
    }),
  )
})

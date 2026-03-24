import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getToolCallsDom } from '../src/parts/GetToolCallsDom/GetToolCallsDom.ts'

test('getToolCallsDom should render one list item per tool call', () => {
  const result = getToolCallsDom({
    id: 'message-1',
    role: 'assistant',
    text: '',
    time: '10:00',
    toolCalls: [
      {
        arguments: '{"path":"a.txt"}',
        id: 'call_1',
        name: 'read_file',
      },
      {
        arguments: '{"path":"b.txt"}',
        id: 'call_2',
        name: 'read_file',
      },
    ],
  })

  expect(result).toEqual([
    {
      childCount: 2,
      className: ClassNames.ChatToolCalls,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallsLabel,
      type: VirtualDomElements.Div,
    },
    expect.objectContaining({
      text: 'tools',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 2,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: 'a.txt',
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      className: ClassNames.FileIcon,
    }),
    expect.objectContaining({
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    }),
    expect.objectContaining({
      text: 'read_file ',
    }),
    expect.objectContaining({
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': 'a.txt',
      onClick: expect.any(Number),
      type: VirtualDomElements.Span,
    }),
    expect.objectContaining({
      className: ClassNames.ChatToolCallFileName,
      'data-uri': 'a.txt',
      onClick: expect.any(Number),
      type: VirtualDomElements.Span,
    }),
    expect.objectContaining({
      text: 'a.txt',
    }),
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: 'b.txt',
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      className: ClassNames.FileIcon,
    }),
    expect.objectContaining({
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    }),
    expect.objectContaining({
      text: 'read_file ',
    }),
    expect.objectContaining({
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': 'b.txt',
      onClick: expect.any(Number),
      type: VirtualDomElements.Span,
    }),
    expect.objectContaining({
      className: ClassNames.ChatToolCallFileName,
      'data-uri': 'b.txt',
      onClick: expect.any(Number),
      type: VirtualDomElements.Span,
    }),
    expect.objectContaining({
      text: 'b.txt',
    }),
  ])
})

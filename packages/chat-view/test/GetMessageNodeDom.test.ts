// cspell:ignore katex

import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getMessageNodeDom } from '../src/parts/GetMessageNodeDom/GetMessageNodeDom.ts'

test('getMessageNodeDom should render markdown link inline nodes as clickable link dom nodes', () => {
  const result = getMessageNodeDom({
    children: [
      {
        text: 'Source: ',
        type: 'text',
      },
      {
        href: 'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
        text: 'source',
        type: 'link',
      },
    ],
    type: 'text',
  })

  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.Markdown,
    type: VirtualDomElements.P,
  })
  expect(result[1]).toMatchObject({
    text: 'Source: ',
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ChatMessageLink,
    href: 'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
    rel: 'noopener noreferrer',
    target: '_blank',
    title:
      'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
    type: VirtualDomElements.A,
  })
  expect(result[3]).toMatchObject({
    text: 'source',
  })
})

test('getMessageNodeDom should render markdown bold inline nodes as strong dom nodes', () => {
  const result = getMessageNodeDom({
    children: [
      {
        text: 'For ',
        type: 'text',
      },
      {
        children: [
          {
            text: 'Transport Agnostic',
            type: 'text',
          },
        ],
        type: 'bold',
      },
      {
        text: ': over HTTP and WebSocket',
        type: 'text',
      },
    ],
    type: 'text',
  })

  expect(result[0]).toEqual({
    childCount: 3,
    className: ClassNames.Markdown,
    type: VirtualDomElements.P,
  })
  expect(result[1]).toMatchObject({
    text: 'For ',
  })
  expect(result[2]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Strong,
  })
  expect(result[3]).toMatchObject({
    text: 'Transport Agnostic',
  })
  expect(result[4]).toMatchObject({
    text: ': over HTTP and WebSocket',
  })
})

test('getMessageNodeDom should render markdown italic inline nodes as em dom nodes', () => {
  const result = getMessageNodeDom({
    children: [
      {
        text: 'For ',
        type: 'text',
      },
      {
        children: [
          {
            text: 'asynchronous',
            type: 'text',
          },
        ],
        type: 'italic',
      },
      {
        text: ': supports both sync and async communication',
        type: 'text',
      },
    ],
    type: 'text',
  })

  expect(result[0]).toEqual({
    childCount: 3,
    className: ClassNames.Markdown,
    type: VirtualDomElements.P,
  })
  expect(result[1]).toMatchObject({
    text: 'For ',
  })
  expect(result[2]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Em,
  })
  expect(result[3]).toMatchObject({
    text: 'asynchronous',
  })
  expect(result[4]).toMatchObject({
    text: ': supports both sync and async communication',
  })
})

test('getMessageNodeDom should render markdown table nodes as table dom nodes', () => {
  const result = getMessageNodeDom({
    headers: [
      {
        children: [
          {
            text: 'Item',
            type: 'text',
          },
        ],
        type: 'table-cell',
      },
      {
        children: [
          {
            text: 'Quantity',
            type: 'text',
          },
        ],
        type: 'table-cell',
      },
    ],
    rows: [
      {
        cells: [
          {
            children: [
              {
                text: 'Apples',
                type: 'text',
              },
            ],
            type: 'table-cell',
          },
          {
            children: [
              {
                text: '4',
                type: 'text',
              },
            ],
            type: 'table-cell',
          },
        ],
        type: 'table-row',
      },
    ],
    type: 'table',
  })

  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.MarkdownTable,
    type: VirtualDomElements.Table,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    type: VirtualDomElements.THead,
  })
  expect(result[2]).toEqual({
    childCount: 2,
    type: VirtualDomElements.Tr,
  })
  expect(result[3]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Th,
  })
  expect(result[4]).toMatchObject({
    text: 'Item',
  })
  expect(result[5]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Th,
  })
  expect(result[6]).toMatchObject({
    text: 'Quantity',
  })
  expect(result[7]).toEqual({
    childCount: 1,
    type: VirtualDomElements.TBody,
  })
  expect(result[8]).toEqual({
    childCount: 2,
    type: VirtualDomElements.Tr,
  })
  expect(result[9]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Td,
  })
  expect(result[10]).toMatchObject({
    text: 'Apples',
  })
  expect(result[11]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Td,
  })
  expect(result[12]).toMatchObject({
    text: '4',
  })
})

test('getMessageNodeDom should render unordered list nodes as ul and li dom nodes', () => {
  const result = getMessageNodeDom({
    items: [
      {
        children: [
          {
            text: 'Read files',
            type: 'text',
          },
        ],
        type: 'list-item',
      },
      {
        children: [
          {
            text: 'Run tests',
            type: 'text',
          },
        ],
        type: 'list-item',
      },
    ],
    type: 'unordered-list',
  })

  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.ChatUnorderedList,
    type: VirtualDomElements.Ul,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ChatUnorderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toMatchObject({
    text: 'Read files',
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: ClassNames.ChatUnorderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[4]).toMatchObject({
    text: 'Run tests',
  })
})

test('getMessageNodeDom should render nested unordered list inside ordered list item', () => {
  const result = getMessageNodeDom({
    items: [
      {
        children: [
          {
            text: 'Ancient and Medieval Periods:',
            type: 'text',
          },
        ],
        nestedItems: [
          {
            children: [
              {
                text: 'Inhabited since prehistoric times.',
                type: 'text',
              },
            ],
            type: 'list-item',
          },
        ],
        type: 'list-item',
      },
    ],
    type: 'ordered-list',
  })

  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.ChatOrderedList,
    type: VirtualDomElements.Ol,
  })
  expect(result[1]).toEqual({
    childCount: 2,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toMatchObject({
    text: 'Ancient and Medieval Periods:',
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: ClassNames.ChatUnorderedList,
    type: VirtualDomElements.Ul,
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatUnorderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[5]).toMatchObject({
    text: 'Inhabited since prehistoric times.',
  })
})

test('getMessageNodeDom should render code block nodes as pre and code dom nodes', () => {
  const result = getMessageNodeDom({
    text: '{ "jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1 }',
    type: 'code-block',
  })

  expect(result[0]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Pre,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Code,
  })
  expect(result[2]).toMatchObject({
    text: '{ "jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1 }',
  })
})

test('getMessageNodeDom should render heading nodes as matching heading dom nodes', () => {
  const result = getMessageNodeDom({
    children: [
      {
        text: 'Section title',
        type: 'text',
      },
    ],
    level: 3,
    type: 'heading',
  })

  expect(result[0]).toEqual({
    childCount: 1,
    type: VirtualDomElements.H3,
  })
  expect(result[1]).toMatchObject({
    text: 'Section title',
  })
})

test('getMessageNodeDom should render inline math nodes with katex output', () => {
  const result = getMessageNodeDom({
    children: [
      {
        displayMode: false,
        text: 'a^2 + b^2 = c^2',
        type: 'math-inline',
      },
    ],
    type: 'text',
  })

  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.Markdown,
    type: VirtualDomElements.P,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.MarkdownMathInline,
    type: VirtualDomElements.Span,
  })
  expect(result[2]).toMatchObject({
    className: 'katex',
  })
})

test('getMessageNodeDom should render inline math nodes when chat math worker is enabled', () => {
  const result = getMessageNodeDom(
    {
      children: [
        {
          displayMode: false,
          text: 'a^2 + b^2 = c^2',
          type: 'math-inline',
        },
      ],
      type: 'text',
    },
    true,
  )

  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.MarkdownMathInline,
    type: VirtualDomElements.Span,
  })
  expect(result[2]).toMatchObject({
    className: 'katex',
  })
})

test('getMessageNodeDom should render block math nodes in block wrapper', () => {
  const result = getMessageNodeDom({
    text: '\\int_0^1 x^2 \\; dx',
    type: 'math-block',
  })

  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.MarkdownMathBlock,
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toMatchObject({
    className: 'katex-display',
  })
})

test('getMessageNodeDom should keep raw inline math markdown when katex fails', () => {
  const result = getMessageNodeDom({
    children: [
      {
        displayMode: false,
        text: '\\invalid{',
        type: 'math-inline',
      },
    ],
    type: 'text',
  })

  expect(result[1]).toMatchObject({
    text: '$\\invalid{$',
  })
})

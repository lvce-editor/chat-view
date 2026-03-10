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
        text: 'Transport Agnostic',
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

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

test('getMessageNodeDom should render custom-ui html nodes', () => {
  const result = getMessageNodeDom({
    css: '.card { color: red; }',
    html: '<div class="card">Sunny</div>',
    type: 'custom-ui',
  })

  expect(result).toHaveLength(4)
  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.ChatCustomUiContent,
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ChatCustomUiBody,
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: 'card',
    type: VirtualDomElements.Div,
  })
  expect(result[3]).toMatchObject({
    text: 'Sunny',
  })
})

test('getMessageNodeDom should render raw-content parts with pre tag', () => {
  const result = getMessageNodeDom({
    text: ['line 1', 'line 2'].join('\n'),
    type: 'raw-content',
  })

  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.Markdown,
    type: VirtualDomElements.Pre,
  })
  expect(result[1]).toMatchObject({
    text: 'line 1\nline 2',
  })
})

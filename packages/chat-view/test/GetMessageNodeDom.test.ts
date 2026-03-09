import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
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
        text: 'metcheck.com',
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
    'data-href': 'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
    childCount: 1,
    className: ClassNames.ChatMessageLink,
    onClick: DomEventListenerFunctions.HandleClickLink,
    title: 'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'metcheck.com',
  })
})

import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getToolCallDom } from '../src/parts/GetToolCallDom/GetToolCallDom.ts'

test('getToolCallDom should render render_html tool calls as native virtual dom previews', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      css: '.card { color: red; }',
      html: '<div class="card">Sunny</div>',
      title: 'Paris Weather',
    }),
    name: 'render_html',
    status: 'success',
  })

  expect(result).toHaveLength(7)
  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlLabel,
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toMatchObject({
    text: 'render_html: Paris Weather',
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlContent,
    type: VirtualDomElements.Div,
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlBody,
    type: VirtualDomElements.Div,
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: 'card',
    type: VirtualDomElements.Div,
  })
  expect(result[6]).toMatchObject({
    text: 'Sunny',
  })
})

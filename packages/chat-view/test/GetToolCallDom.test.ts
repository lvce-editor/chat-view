import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getToolCallDom } from '../src/parts/GetToolCallDom/GetToolCallDom.ts'

test('getToolCallDom should render render_html tool calls as iframe previews', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      css: '.card { color: red; }',
      html: '<div class="card">Sunny</div>',
      title: 'Paris Weather',
    }),
    name: 'render_html',
    status: 'success',
  })

  expect(result).toHaveLength(4)
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
  expect(result[3]).toMatchObject({
    className: ClassNames.ChatToolCallRenderHtmlFrame,
    loading: 'lazy',
    sandbox: '',
    srcdoc: expect.stringContaining('<div class="card">Sunny</div>'),
    title: 'Paris Weather',
    type: VirtualDomElements.Iframe,
  })
})

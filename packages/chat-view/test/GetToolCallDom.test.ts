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

test('getToolCallDom should include img src from render_html tool calls', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      css: '',
      html: '<img src="https://example.com/pic.png" />',
      title: 'Image Preview',
    }),
    name: 'render_html',
    status: 'success',
  })

  expect(result).toHaveLength(6)
  expect(result[5]).toEqual({
    childCount: 0,
    src: 'https://example.com/pic.png',
    type: VirtualDomElements.Img,
  })
})

test('getToolCallDom should display getWorkspaceUri as get_workspace_uri', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'getWorkspaceUri',
    status: 'success',
  })

  expect(result).toHaveLength(2)
  expect(result[1]).toMatchObject({
    text: 'get_workspace_uri',
  })
})

test('getToolCallDom should not display empty object arguments', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'unknown_tool',
    status: 'success',
  })

  expect(result).toHaveLength(2)
  expect(result[1]).toMatchObject({
    text: 'unknown_tool',
  })
})

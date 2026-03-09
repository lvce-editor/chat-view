import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ParseHtmlToVirtualDom from '../src/parts/ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts'

test('parseHtmlToVirtualDom should parse block and inline nodes', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<div class="card"><p>Hello <strong>World</strong></p></div>')

  expect(result[0]).toEqual({
    childCount: 1,
    className: 'card',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 2,
    type: VirtualDomElements.P,
  })
  expect(result[2]).toMatchObject({
    text: 'Hello ',
  })
  expect(result[3]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Span,
  })
  expect(result[4]).toMatchObject({
    text: 'World',
  })
})

test('parseHtmlToVirtualDom should sanitize javascript href', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<a href="javascript:alert(1)">Open</a>')

  expect(result[0]).toEqual({
    childCount: 1,
    href: '#',
    type: VirtualDomElements.A,
  })
})

test('parseHtmlToVirtualDomWithRootCount should report root child count', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDomWithRootCount('<div>One</div><div>Two</div>')

  expect(result.rootChildCount).toBe(2)
  expect(result.virtualDom).toHaveLength(4)
})

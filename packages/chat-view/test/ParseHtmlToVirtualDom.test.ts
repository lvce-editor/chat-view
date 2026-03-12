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
    type: VirtualDomElements.Strong,
  })
  expect(result[4]).toMatchObject({
    text: 'World',
  })
})

test('parseHtmlToVirtualDom should sanitize non-http href', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<a href="javascript:alert(1)">Open</a>')

  expect(result[0]).toEqual({
    childCount: 1,
    href: '#',
    type: VirtualDomElements.A,
  })
})

test('parseHtmlToVirtualDom should sanitize data href', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Open</a>')

  expect(result[0]).toEqual({
    childCount: 1,
    href: '#',
    type: VirtualDomElements.A,
  })
})

test('parseHtmlToVirtualDom should keep img src attribute', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<img src="https://example.com/image.png" alt="Preview" />')

  expect(result[0]).toEqual({
    childCount: 0,
    src: 'https://example.com/image.png',
    type: VirtualDomElements.Img,
  })
})

test('parseHtmlToVirtualDom should sanitize javascript img src', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<img src="javascript:alert(1)" />')

  expect(result[0]).toEqual({
    childCount: 0,
    src: '#',
    type: VirtualDomElements.Img,
  })
})

test('parseHtmlToVirtualDom should sanitize data img src', () => {
  // eslint-disable-next-line @cspell/spellchecker
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==" />')

  expect(result[0]).toEqual({
    childCount: 0,
    src: '#',
    type: VirtualDomElements.Img,
  })
})

test('parseHtmlToVirtualDom should sanitize blob img src', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<img src="blob:https://example.com/abc-123" />')

  expect(result[0]).toEqual({
    childCount: 0,
    src: '#',
    type: VirtualDomElements.Img,
  })
})

test('parseHtmlToVirtualDomWithRootCount should report root child count', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDomWithRootCount('<div>One</div><div>Two</div>')

  expect(result.rootChildCount).toBe(2)
  expect(result.virtualDom).toHaveLength(4)
})

test('parseHtmlToVirtualDom should map table elements to virtual dom table types', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom(
    '<table><thead><tr><th>H</th></tr></thead><tbody><tr><td>C</td></tr></tbody><tfoot><tr><td>F</td></tr></tfoot></table>',
  )

  expect(result[0]).toEqual({
    childCount: 3,
    type: VirtualDomElements.Table,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    type: VirtualDomElements.THead,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Tr,
  })
  expect(result[3]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Th,
  })
  expect(result[5]).toEqual({
    childCount: 1,
    type: VirtualDomElements.TBody,
  })
  expect(result[6]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Tr,
  })
  expect(result[7]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Td,
  })
  expect(result[9]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Tfoot,
  })
  expect(result[10]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Tr,
  })
  expect(result[11]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Td,
  })
})

test('parseHtmlToVirtualDom should map ul to ul type', () => {
  const result = ParseHtmlToVirtualDom.parseHtmlToVirtualDom('<ul><li>Item</li></ul>')

  expect(result[0]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Ul,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    type: VirtualDomElements.Li,
  })
})

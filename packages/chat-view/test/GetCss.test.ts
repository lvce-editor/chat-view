import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss should style tool call file names as clickable links on hover', () => {
  const css = getCss(28, 280, 24, 13, 20, 'system-ui', 700, 0, 12, 12, 0, 10, 8, 8, 10, '')

  expect(css).toContain('.ChatToolCallFileName{')
  expect(css).toContain('cursor: pointer;')
  expect(css).toContain('.ChatToolCallFileName:hover{')
  expect(css).toContain('color: var(--vscode-textLink-foreground);')
})

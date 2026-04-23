import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss should include scoped scrollbar styling for chat panes', () => {
  const result = getCss(32, 0, 28, 40, 13, 20, 'monospace', 860, 240, 8, 10, 10, 8, 10, 12, 12, 10, '')

  expect(result).toContain('--ChatScrollbarThickness: 10px;')
  expect(result).toContain('.ChatList,\n.ProjectList,\n.ChatMessages {')
  expect(result).toContain('.ChatMessages::-webkit-scrollbar-thumb:hover {')
  expect(result).toContain('scrollbar-width: thin;')
})

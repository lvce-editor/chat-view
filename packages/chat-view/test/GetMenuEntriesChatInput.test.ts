import { expect, test } from '@jest/globals'
import * as GetMenuEntriesChatInput from '../src/parts/GetMenuEntriesChatInput/GetMenuEntriesChatInput.ts'

test('getMenuEntriesChatInput should expose cut copy and paste entries', () => {
  const entries = GetMenuEntriesChatInput.getMenuEntriesChatInput()

  expect(entries).toEqual([
    {
      command: 'Chat.handleInputCut',
      flags: 0,
      id: 'cut',
      label: 'Cut',
    },
    {
      command: 'Chat.handleInputCopy',
      flags: 0,
      id: 'copy',
      label: 'Copy',
    },
    {
      command: 'Chat.handleInputPaste',
      flags: 0,
      id: 'paste',
      label: 'Paste',
    },
  ])
})

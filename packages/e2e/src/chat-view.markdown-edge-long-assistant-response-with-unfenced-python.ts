/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge-long-assistant-response-with-unfenced-python'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-1', [
    {
      id: 'message-1',
      role: 'user',
      text: 'please help dedupe css rules',
      time: '03:13 PM',
    },
    {
      id: 'message-2',
      inProgress: false,
      role: 'assistant',
      text: `I can do that, but I need the file contents (or your confirmation which de-duplication rule you want) before I edit it.

Two quick questions so I do exactly what you want:
1. Do you want only exact duplicate rule-blocks removed (identical selector + identical declarations), or do you want "normalized" deduping that also collapses rule-blocks with the same declarations in different order?
   - "Exact" is safest (keeps original order and casing).
   - "Normalized" is more aggressive (removes duplicates even if declarations are reordered), which may change rule ordering but usually gives a smaller, cleaner file.

2. Please either paste the contents of .../ChatTool.css here, or upload the file. If you prefer to run something locally instead, I can give a ready-to-run script and instructions.

Python script (save as dedupe_css.py):

#!/usr/bin/env python3
# keep name, value and priority (!important)
def normalize_decls(style):
    decls = []
    for d in style:
        decls.append((d.name.strip(), d.value.strip(), d.priority or ""))
    return decls

How to run:
- Install cssutils: pip install cssutils
- Run: python dedupe_css.py ChatTool.css ChatTool.cleaned.css normalized`,
      time: '03:14 PM',
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)

  const assistant = messages.nth(1)
  await expect(assistant).toContainText('Two quick questions so I do exactly what you want:')
  await expect(assistant).toContainText('Do you want only exact duplicate rule-blocks removed')
  await expect(assistant).toContainText('Python script (save as dedupe_css.py):')
  await expect(assistant).toContainText('How to run:')

  const orderedLists = Locator('.ChatMessages .Message ol')
  await expect(orderedLists).toHaveCount(1)
}

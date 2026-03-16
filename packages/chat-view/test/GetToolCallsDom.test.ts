import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getToolCallsDom } from '../src/parts/GetToolCallsDom/GetToolCallsDom.ts'

test('getToolCallsDom should render one list item per tool call', () => {
  const result = getToolCallsDom({
    id: 'message-1',
    role: 'assistant',
    text: '',
    time: '10:00',
    toolCalls: [
      {
        arguments: '{"path":"a.txt"}',
        id: 'call_1',
        name: 'read_file',
      },
      {
        arguments: '{"path":"b.txt"}',
        id: 'call_2',
        name: 'read_file',
      },
    ],
  })

  const orderedList = result.find((node) => node.type === VirtualDomElements.Ol)
  const listItems = result.filter((node) => node.className === ClassNames.ChatOrderedListItem && node.type === VirtualDomElements.Li)

  expect(orderedList).toMatchObject({
    childCount: 2,
    className: ClassNames.ChatOrderedList,
  })
  expect(listItems).toHaveLength(2)
})

import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatDebugViewDom from '../src/parts/GetChatDebugViewDom/GetChatDebugViewDom.ts'

test('getChatDebugViewDom should wire filter input to filter input listener', () => {
  const dom = GetChatDebugViewDom.getChatDebugViewDom('session-1', '', '', false, false, []) as readonly {
    readonly name?: string
    readonly onInput?: number
  }[]
  const filterInput = dom.find((node) => node.name === 'filter')

  expect(filterInput).toBeDefined()
  expect(filterInput.onInput).toBe(DomEventListenerFunctions.HandleFilterInput)
})

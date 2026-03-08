import { expect, test } from '@jest/globals'
import * as CommandMap from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap should expose all expected chat debug commands', () => {
  const commandIds = Object.keys(CommandMap.commandMap).sort()
  expect(commandIds).toEqual([
    'ChatDebug.create',
    'ChatDebug.diff2',
    'ChatDebug.getCommandIds',
    'ChatDebug.handleInput',
    'ChatDebug.loadContent',
    'ChatDebug.loadContent2',
    'ChatDebug.refresh',
    'ChatDebug.render2',
    'ChatDebug.renderEventListeners',
    'ChatDebug.rerender',
    'ChatDebug.resize',
    'ChatDebug.saveState',
    'ChatDebug.setSessionId',
    'ChatDebug.terminate',
  ])
})

test('commandMap values should all be functions', () => {
  for (const command of Object.values(CommandMap.commandMap)) {
    expect(typeof command).toBe('function')
  }
})

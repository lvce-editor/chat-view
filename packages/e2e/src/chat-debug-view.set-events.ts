import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-debug-view.set-events'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Main.openUri', 'chat-debug://e2e-session-render')
  await expect(Locator('.ChatDebugView')).toBeVisible()

  const events = [
    {
      sessionId: 'e2e-session-render',
      timestamp: '2026-03-08T00:00:00.000Z',
      type: 'handle-submit',
      value: 'Hello',
    },
    {
      sessionId: 'e2e-session-render',
      timestamp: '2026-03-08T00:00:01.000Z',
      type: 'handle-response',
      value: 'Hi there',
    },
  ]

  // act
  await Command.execute('ChatDebug.setEvents', events)

  // assert
  const eventNodes = Locator('.ChatDebugViewEvent')
  await expect(eventNodes).toHaveCount(2)
  await expect(eventNodes.nth(0)).toContainText('"type": "handle-submit"')
  await expect(eventNodes.nth(1)).toContainText('"type": "handle-response"')
}

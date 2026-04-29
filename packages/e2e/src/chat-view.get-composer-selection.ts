import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.get-composer-selection'

const assertEqual = <T>(actual: T, expected: T, context: string): void => {
  if (actual !== expected) {
    throw new Error(`${context}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  await Chat.handleInput('hello world')
  await Command.execute('Chat.setComposerSelection', 6, 11)

  const selection = (await Command.execute('Chat.getComposerSelection')) as readonly [number, number]
  assertEqual(selection[0], 6, 'selection start')
  assertEqual(selection[1], 11, 'selection end')
}

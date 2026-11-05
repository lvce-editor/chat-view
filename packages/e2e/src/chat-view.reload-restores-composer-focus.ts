import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.reload-restores-composer-focus'

export const test: Test = async ({ Chat, expect, KeyBoard, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.handleClickNew()

  const composer = Locator('.ChatInputBox[name="composer"]')
  await expect(composer).toBeFocused()

  await KeyBoard.press('ControlOrMeta+R')

  await expect(composer).toBeFocused()
  await composer.type('hello after reload')
  await expect(composer).toHaveValue('hello after reload')
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.new-chat-empty-input-composer-visible'

export const skip = 1

export const test: Test = async ({ Chat, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  const composer = Locator('.MultilineInputBox[name="composer"]')
  await expect(composer).toBeVisible()

  await Chat.handleClickNew()
  await composer.type('abc')
  await expect(composer).toHaveValue('abc')

  await Chat.handleClickNew()
  await expect(composer).toHaveValue('')

  await Chat.handleClickNew()
  await expect(composer).toHaveValue('')
  await expect(composer).toBeVisible()
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.composer-value-preserved-hide-show-secondary-sidebar'

export const test: Test = async ({ Chat, expect, Locator }) => {
  const draftValue = 'draft survives secondary sidebar toggle'

  await Chat.show()
  await Chat.reset()

  const chat = Locator('.Chat')
  const composer = Locator('.ChatInputBox[name="composer"]')

  await expect(chat).toBeVisible()
  await expect(composer).toBeVisible()

  await Chat.handleInput(draftValue)

  await expect(composer).toHaveValue(draftValue)

  await Chat.handleClickClose()

  await expect(chat).toBeHidden()

  await Chat.show()

  await expect(chat).toBeVisible()
  await expect(composer).toBeVisible()
  await expect(composer).toHaveValue(draftValue)
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-disabled-while-pending'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Command.execute('Chat.mockBackendAuthResponse', {
    accessToken: 'access-token-delayed',
    delay: 900,
    refreshToken: 'refresh-token-delayed',
    type: 'success',
    usedTokens: 1,
    userName: 'simon',
  })

  const loginButton = Locator('.IconButton[name="login"]')
  const logoutButton = Locator('.IconButton[name="logout"]')

  await expect(loginButton).toBeVisible()

  const clickPromise = loginButton.click()
  await expect(loginButton).toBeDisabled()
  await clickPromise

  await expect(logoutButton).toBeVisible()
  await expect(loginButton).toHaveCount(0)
}

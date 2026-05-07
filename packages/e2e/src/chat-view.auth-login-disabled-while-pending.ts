import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-disabled-while-pending'

export const skip = 1
export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Chat.mockBackendAuthResponse({
    accessToken: 'access-token-delayed',
    delay: 900,
    type: 'success',
    usedTokens: 1,
    userName: 'test',
  })

  const loginButton = Locator('button[name="login"]')
  const pendingLoginButton = Locator('button[name="login"][title="Logging in to backend"]')
  const logoutButton = Locator('button[name="logout"]')

  await expect(loginButton).toBeVisible()

  const clickPromise = Command.execute('Chat.handleClick', 'login')
  await expect(pendingLoginButton).toBeVisible()
  await clickPromise

  await expect(logoutButton).toBeVisible()
  await expect(loginButton).toHaveCount(0)
}

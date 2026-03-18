import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-success'

interface AuthState {
  readonly authAccessToken: string
  readonly authRefreshToken: string
  readonly authStatus: 'signed-out' | 'signing-in' | 'signed-in'
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Command.execute('Chat.mockBackendAuthResponse', {
    accessToken: 'access-token-1',
    refreshToken: 'refresh-token-1',
    subscriptionPlan: 'pro',
    type: 'success',
    usedTokens: 42,
    userName: 'simon',
  })

  const loginButton = Locator('.IconButton[name="login"]')
  const logoutButton = Locator('.IconButton[name="logout"]')

  await expect(loginButton).toBeVisible()
  await expect(logoutButton).toHaveCount(0)

  await loginButton.click()

  await expect(Locator('.ChatAuthError')).toHaveCount(0)
  await expect(logoutButton).toBeVisible()
  await expect(loginButton).toHaveCount(0)

  const authState = (await Command.execute('Chat.getAuthState')) as AuthState
  expect(authState.authAccessToken).toBe('access-token-1')
  expect(authState.authRefreshToken).toBe('refresh-token-1')
  expect(authState.authStatus).toBe('signed-in')
}

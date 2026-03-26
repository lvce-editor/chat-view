import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-success'

const assertEqual = <T>(actual: T, expected: T, context: string): void => {
  if (actual !== expected) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Error(`${context}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

interface AuthState {
  readonly authAccessToken: string
  readonly authRefreshToken: string
  readonly authStatus: 'signed-out' | 'signing-in' | 'signed-in'
}

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Chat.mockBackendAuthResponse({
    accessToken: 'access-token-1',
    refreshToken: 'refresh-token-1',
    subscriptionPlan: 'pro',
    type: 'success',
    usedTokens: 42,
    userName: 'test',
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
  assertEqual(authState.authAccessToken, 'access-token-1', 'auth access token')
  assertEqual(authState.authRefreshToken, 'refresh-token-1', 'auth refresh token')
  assertEqual(authState.authStatus, 'signed-in', 'auth status')
}

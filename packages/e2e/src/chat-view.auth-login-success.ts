import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-success'

const assertEqual = <T>(actual: T, expected: T, context: string): void => {
  if (actual !== expected) {
    throw new Error(`${context}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

interface AuthState {
  readonly authAccessToken: string
  readonly userName: string
  readonly userState: 'loggedIn' | 'loggingIn' | 'loggedOut' | 'loggingOut'
}

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Chat.mockBackendAuthResponse({
    accessToken: 'access-token-1',
    subscriptionPlan: 'pro',
    type: 'success',
    usedTokens: 42,
    userName: 'test',
  })

  const loginButton = Locator('button[name="login"]')
  const logoutButton = Locator('button[name="logout"]')

  await expect(loginButton).toBeVisible()
  await expect(logoutButton).toHaveCount(0)

  await loginButton.click()

  await expect(Locator('.ChatAuthError')).toHaveCount(0)
  await expect(logoutButton).toBeVisible()
  await expect(loginButton).toHaveCount(0)
  await expect(Locator('.ChatHeaderAuthName')).toHaveText('test')

  const authState = (await Command.execute('Chat.getAuthState')) as AuthState
  assertEqual(authState.authAccessToken, 'access-token-1', 'auth access token')
  assertEqual(authState.userName, 'test', 'user name')
  assertEqual(authState.userState, 'loggedIn', 'user state')
}

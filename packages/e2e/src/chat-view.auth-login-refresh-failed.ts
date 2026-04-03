import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-refresh-failed'

const assertEqual = <T>(actual: T, expected: T, context: string): void => {
  if (actual !== expected) {
    throw new Error(`${context}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

interface AuthState {
  readonly authErrorMessage: string
  readonly userState: 'loggedIn' | 'loggingIn' | 'loggedOut' | 'loggingOut'
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Chat.mockBackendAuthResponse({
    errorName: 'TypeError',
    message: 'Failed to fetch',
    request: 'refresh',
    type: 'error',
  })

  const loginButton = Locator('button[name="login"]')
  const logoutButton = Locator('button[name="logout"]')
  const authError = Locator('.ChatAuthError')

  await expect(loginButton).toBeVisible()
  await loginButton.click()

  await expect(authError).toBeVisible()
  await expect(authError).toHaveText('Auth backend error or unavailable.')
  await expect(loginButton).toBeVisible()
  await expect(logoutButton).toHaveCount(0)

  const authState = (await Command.execute('Chat.getAuthState')) as AuthState
  assertEqual(authState.authErrorMessage, 'Auth backend error or unavailable.', 'auth error message')
  assertEqual(authState.userState, 'loggedOut', 'user state')
}

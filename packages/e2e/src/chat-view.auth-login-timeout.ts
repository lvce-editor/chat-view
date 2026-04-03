import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-timeout'

const assertEqual = <T>(actual: T, expected: T, context: string): void => {
  if (actual !== expected) {
    throw new Error(`${context}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

interface AuthState {
  readonly authErrorMessage: string
  readonly authMaxDelay: number
  readonly userState: 'loggedIn' | 'loggingIn' | 'loggedOut' | 'loggingOut'
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setAuthMaxDelay', 50)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Chat.mockBackendAuthResponse({
    accessToken: 'access-token-delayed',
    delay: 200,
    request: 'refresh',
    type: 'success',
    userName: 'test',
  })

  const loginButton = Locator('button[name="login"]')
  const logoutButton = Locator('button[name="logout"]')
  const authError = Locator('.ChatAuthError')

  await expect(loginButton).toBeVisible()
  await Command.execute('Chat.handleClick', 'login')

  await expect(authError).toBeVisible()
  await expect(authError).toHaveText('Backend authentication timed out.')
  await expect(loginButton).toBeVisible()
  await expect(logoutButton).toHaveCount(0)

  const authState = (await Command.execute('Chat.getAuthState')) as AuthState
  assertEqual(authState.authErrorMessage, 'Backend authentication timed out.', 'auth error message')
  assertEqual(authState.authMaxDelay, 50, 'auth max delay')
  assertEqual(authState.userState, 'loggedOut', 'user state')
}
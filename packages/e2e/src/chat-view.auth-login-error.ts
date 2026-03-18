import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.auth-login-error'

interface AuthState {
  readonly authStatus: 'signed-out' | 'signing-in' | 'signed-in'
}

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Command.execute('Chat.setAuthEnabled', true)
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Command.execute('Chat.mockBackendAuthResponse', {
    message: 'Invalid backend credentials.',
    type: 'error',
  })

  const loginButton = Locator('.IconButton[name="login"]')
  const logoutButton = Locator('.IconButton[name="logout"]')

  await expect(loginButton).toBeVisible()
  await loginButton.click()

  const authError = Locator('.ChatAuthError')
  await expect(authError).toBeVisible()
  await expect(authError).toHaveText('Invalid backend credentials.')
  await expect(loginButton).toBeVisible()
  await expect(logoutButton).toHaveCount(0)

  const authState = (await Command.execute('Chat.getAuthState')) as AuthState
  expect(authState.authStatus).toBe('signed-out')
}

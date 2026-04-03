import type { BackendAuthState } from '../BackendAuthState/BackendAuthState.ts'
import { delay } from '../../Delay/Delay.ts'
import { defaultAuthMaxDelay } from '../../DefaultAuthMaxDelay/DefaultAuthMaxDelay.ts'
import { getLoggedOutBackendAuthState } from '../GetLoggedOutBackendAuthState/GetLoggedOutBackendAuthState.ts'
import { syncBackendAuth } from '../SyncBackendAuth/SyncBackendAuth.ts'

export const waitForBackendLogin = async (backendUrl: string, timeoutMs = defaultAuthMaxDelay, pollIntervalMs = 1000): Promise<BackendAuthState> => {
  const deadline = Date.now() + timeoutMs
  let lastErrorMessage = ''
  while (Date.now() < deadline) {
    const remainingTime = Math.max(0, deadline - Date.now())
    const authState = await syncBackendAuth(backendUrl, remainingTime)
    if (authState.userState === 'loggedIn') {
      return authState
    }
    if (authState.authErrorMessage) {
      return getLoggedOutBackendAuthState(authState.authErrorMessage)
    }
    await delay(pollIntervalMs)
  }
  return getLoggedOutBackendAuthState(lastErrorMessage)
}

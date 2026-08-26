import { PlatformType } from '@lvce-editor/constants'
import { AuthWorker, OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getBackendLoginRequest, getLoggedOutBackendAuthState, waitForBackendLogin, waitForElectronBackendLogin } from '../BackendAuth/BackendAuth.ts'
import * as MockBackendAuth from '../MockBackendAuth/MockBackendAuth.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

interface LoginResponse {
  readonly accessToken?: string
  readonly error?: string
  readonly subscriptionPlan?: string
  readonly usedTokens?: number
  readonly userName?: string
}

const isLoginResponse = (value: unknown): value is LoginResponse => {
  return !!value && typeof value === 'object'
}

const getLoggedInState = (state: ChatState, response: LoginResponse): ChatState => {
  const { userName, userSubscriptionPlan, userUsedTokens } = state
  const accessToken = typeof response.accessToken === 'string' ? response.accessToken : ''
  return {
    ...state,
    authAccessToken: accessToken,
    authErrorMessage: '',
    userName: typeof response.userName === 'string' ? response.userName : userName,
    userState: accessToken ? 'loggedIn' : 'loggedOut',
    userSubscriptionPlan: typeof response.subscriptionPlan === 'string' ? response.subscriptionPlan : userSubscriptionPlan,
    userUsedTokens: typeof response.usedTokens === 'number' ? response.usedTokens : userUsedTokens,
  }
}

export const handleClickLogin = async (state: ChatState): Promise<ChatState> => {
  const { authUseRedirect, backendUrl, platform, uid, useAuthWorker } = state
  if (!backendUrl) {
    return {
      ...state,
      authErrorMessage: 'Backend URL is missing.',
      userState: 'loggedOut',
    }
  }
  const signingInState: ChatState = {
    ...state,
    authErrorMessage: '',
    userState: 'loggingIn',
  }
  if (uid) {
    set(uid, state, signingInState)
  }
  try {
    if (useAuthWorker) {
      const authState = await AuthWorker.login({
        authUseRedirect,
        backendUrl,
        platform,
        uid,
      })
      return {
        ...signingInState,
        ...authState,
      }
    }
    if (uid) {
      await RendererWorker.invoke('Chat.rerender')
    }
    if (MockBackendAuth.hasPendingMockLoginResponse()) {
      const response = await MockBackendAuth.consumeNextLoginResponse()
      if (!isLoginResponse(response)) {
        return {
          ...signingInState,
          authErrorMessage: 'Backend returned an invalid login response.',
          userState: 'loggedOut',
        }
      }
      if (typeof response.error === 'string' && response.error) {
        return {
          ...signingInState,
          authErrorMessage: response.error,
          userState: 'loggedOut',
        }
      }
      return getLoggedInState(signingInState, response)
    }
    const { loginUrl, redirectUri } = await getBackendLoginRequest(backendUrl, platform, uid)
    await OpenerWorker.invoke('Open.openUrl', loginUrl, platform, authUseRedirect)
    const authState =
      platform === PlatformType.Electron ? await waitForElectronBackendLogin(backendUrl, uid, redirectUri) : await waitForBackendLogin(backendUrl)
    return {
      ...signingInState,
      ...authState,
    }
  } catch (error) {
    const errorMessage = error instanceof Error && error.message ? error.message : 'Backend authentication failed.'
    return {
      ...signingInState,
      ...getLoggedOutBackendAuthState(errorMessage),
    }
  }
}

import { openRouterRequestFailedMessage } from '../chatViewStrings/chatViewStrings.ts'
import type { GetOpenRouterAssistantTextErrorResult } from './GetOpenRouterAssistantText.ts'
import { getOpenRouterTooManyRequestsMessage } from './GetOpenRouterTooManyRequestsMessage.ts'

export const getOpenRouterErrorMessage = (errorResult: GetOpenRouterAssistantTextErrorResult): string => {
  switch (errorResult.details) {
    case 'http-error':
    case 'request-failed':
      return openRouterRequestFailedMessage
    case 'too-many-requests':
      return getOpenRouterTooManyRequestsMessage(errorResult)
  }
}

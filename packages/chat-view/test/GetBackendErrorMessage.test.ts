import { expect, test } from '@jest/globals'
import { backendCompletionFailedMessage } from '../src/parts/ChatStrings/ChatStrings.ts'
import { getBackendErrorMessage } from '../src/parts/GetBackendErrorMessage/GetBackendErrorMessage.ts'

test('getBackendErrorMessage should format backend HTTP errors with status code and trimmed message', () => {
  const result = getBackendErrorMessage({
    details: 'http-error',
    errorMessage: '  Vercel AI Gateway error (status 403): AI Gateway requires a valid credit card on file to service requests.  ',
    statusCode: 403,
  })

  expect(result).toBe(
    'Backend completion request failed (status 403). Vercel AI Gateway error (status 403): AI Gateway requires a valid credit card on file to service requests.',
  )
})

test('getBackendErrorMessage should format backend HTTP errors with status code and no message', () => {
  const result = getBackendErrorMessage({
    details: 'http-error',
    statusCode: 500,
  })

  expect(result).toBe('Backend completion request failed (status 500).')
})

test('getBackendErrorMessage should format backend HTTP errors with message and no status code', () => {
  const result = getBackendErrorMessage({
    details: 'http-error',
    errorMessage: '  Backend overloaded.  ',
  })

  expect(result).toBe('Backend completion request failed. Backend overloaded.')
})

test('getBackendErrorMessage should return the generic request failed message for transport failures', () => {
  const result = getBackendErrorMessage({
    details: 'request-failed',
  })

  expect(result).toBe(backendCompletionFailedMessage)
})

test('getBackendErrorMessage should include transport error details when available', () => {
  const result = getBackendErrorMessage({
    details: 'request-failed',
    errorMessage: 'fetch failed',
  })

  expect(result).toBe('Backend completion request failed. fetch failed')
})

test('getBackendErrorMessage should include invalid response details when available', () => {
  const result = getBackendErrorMessage({
    details: 'invalid-response',
    errorMessage: 'Unexpected backend response format: no assistant text or tool calls were returned.',
  })

  expect(result).toBe('Backend completion request failed. Unexpected backend response format: no assistant text or tool calls were returned.')
})

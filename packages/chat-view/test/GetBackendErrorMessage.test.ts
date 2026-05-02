import { expect, test } from '@jest/globals'
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

test('getBackendErrorMessage should include backend error code for HTTP errors', () => {
  const result = getBackendErrorMessage({
    details: 'http-error',
    errorCode: 'E_LVCE_USAGE_EXCEEDED',
    errorMessage: 'Monthly virtual token allowance exceeded.',
    statusCode: 402,
  })

  expect(result).toBe('Backend completion request failed (status 402: E_LVCE_USAGE_EXCEEDED). Monthly virtual token allowance exceeded.')
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

  expect(result).toBe(
    'Backend completion request failed (network_error). Unable to reach the backend. Please check that the backend is running, reachable from the browser, and allows this origin.',
  )
})

test('getBackendErrorMessage should include transport error details when available', () => {
  const result = getBackendErrorMessage({
    details: 'request-failed',
    errorMessage: 'Failed to fetch',
  })

  expect(result).toBe(
    'Backend completion request failed (network_error). Failed to fetch. Please check that the backend is running, reachable from the browser, and allows this origin.',
  )
})

test('getBackendErrorMessage should include invalid response details when available', () => {
  const result = getBackendErrorMessage({
    details: 'invalid-response',
    errorMessage: 'Unexpected backend response format: no assistant text or tool calls were returned.',
  })

  expect(result).toBe('Backend completion request failed. Unexpected backend response format: no assistant text or tool calls were returned.')
})

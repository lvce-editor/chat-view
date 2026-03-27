import { expect, test } from '@jest/globals'
import type { GetOpenApiAssistantTextErrorResult } from '../src/parts/GetOpenApiAssistantTextErrorResult/GetOpenApiAssistantTextErrorResult.ts'
import { openApiRequestFailedMessage, openApiRequestFailedOfflineMessage } from '../src/parts/ChatStrings/ChatStrings.ts'
import { defaultMaxToolCalls } from '../src/parts/DefaultMaxToolCalls/DefaultMaxToolCalls.ts'
import { getOpenApiErrorMessage } from '../src/parts/GetOpenApiErrorMessage/GetOpenApiErrorMessage.ts'

const createHttpError = (overrides: Partial<GetOpenApiAssistantTextErrorResult> = {}): GetOpenApiAssistantTextErrorResult => ({
  details: 'http-error',
  type: 'error',
  ...overrides,
})

test('getOpenApiErrorMessage should format invalid_api_key errors with default status 401', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorCode: 'invalid_api_key',
    }),
  )

  expect(result).toBe('OpenAI request failed (Status 401): Invalid API key. Please verify your OpenAI API key in Chat Settings.')
})

test('getOpenApiErrorMessage should format invalid_api_key errors with provided status code', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorCode: 'invalid_api_key',
      statusCode: 403,
    }),
  )

  expect(result).toBe('OpenAI request failed (Status 403): Invalid API key. Please verify your OpenAI API key in Chat Settings.')
})

test('getOpenApiErrorMessage should format 429 errors without extra details', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      statusCode: 429,
    }),
  )

  expect(result).toBe('OpenAI rate limit exceeded (429).')
})

test('getOpenApiErrorMessage should format 429 errors with code, type and trimmed message', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorCode: 'rate_limit_exceeded',
      errorMessage: '  Too many requests, retry later.  ',
      errorType: 'requests',
      statusCode: 429,
    }),
  )

  expect(result).toBe('OpenAI rate limit exceeded (429: rate_limit_exceeded) [requests]. Too many requests, retry later.')
})

test('getOpenApiErrorMessage should format generic HTTP errors with status, code, type and trimmed message', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorCode: 'bad_request',
      errorMessage: '  Invalid payload.  ',
      errorType: 'invalid_request_error',
      statusCode: 400,
    }),
  )

  expect(result).toBe('OpenAI request failed (status 400): bad_request [invalid_request_error]. Invalid payload.')
})

test('getOpenApiErrorMessage should format unsupported_parameter errors for reasoning effort', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorCode: 'unsupported_parameter',
      errorMessage: "Unsupported parameter: 'reasoning.effort' is not supported with this model.",
      errorType: 'invalid_request_error',
      statusCode: 400,
    }),
  )

  expect(result).toBe(
    "OpenAI request failed (status 400): unsupported_parameter [invalid_request_error]. Unsupported parameter: 'reasoning.effort' is not supported with this model.",
  )
})

test('getOpenApiErrorMessage should format generic HTTP errors with status and no message', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorCode: 'bad_request',
      errorType: 'invalid_request_error',
      statusCode: 400,
    }),
  )

  expect(result).toBe('OpenAI request failed (status 400): bad_request [invalid_request_error].')
})

test('getOpenApiErrorMessage should format HTTP errors with only trimmed message when status is missing', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorMessage: '  Server temporarily unavailable.  ',
    }),
  )

  expect(result).toBe('OpenAI request failed. Server temporarily unavailable.')
})

test('getOpenApiErrorMessage should return default request failed message for HTTP errors with blank message', () => {
  const result = getOpenApiErrorMessage(
    createHttpError({
      errorMessage: '   ',
    }),
  )

  expect(result).toBe(openApiRequestFailedMessage)
})

test('getOpenApiErrorMessage should return offline message when request-failed includes isOffline=true', () => {
  const result = getOpenApiErrorMessage({
    details: 'request-failed',
    isOffline: true,
    type: 'error',
  })

  expect(result).toBe(openApiRequestFailedOfflineMessage)
})

test('getOpenApiErrorMessage should return offline message when navigator reports offline', () => {
  const hasNavigator = Object.hasOwn(globalThis, 'navigator')
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    enumerable: true,
    value: { onLine: false },
    writable: true,
  })
  try {
    const result = getOpenApiErrorMessage({
      details: 'request-failed',
      isOffline: false,
      type: 'error',
    })

    expect(result).toBe(openApiRequestFailedOfflineMessage)
  } finally {
    if (hasNavigator && originalDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'navigator')
    }
  }
})

test('getOpenApiErrorMessage should return generic request failed message when navigator is online', () => {
  const hasNavigator = Object.hasOwn(globalThis, 'navigator')
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    enumerable: true,
    value: { onLine: true },
    writable: true,
  })
  try {
    const result = getOpenApiErrorMessage({
      details: 'request-failed',
      type: 'error',
    })

    expect(result).toBe(openApiRequestFailedMessage)
  } finally {
    if (hasNavigator && originalDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'navigator')
    }
  }
})

test('getOpenApiErrorMessage should return generic request failed message when navigator is unavailable', () => {
  const hasNavigator = Object.hasOwn(globalThis, 'navigator')
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Reflect.deleteProperty(globalThis, 'navigator')
  try {
    const result = getOpenApiErrorMessage({
      details: 'request-failed',
      type: 'error',
    })

    expect(result).toBe(openApiRequestFailedMessage)
  } finally {
    if (hasNavigator && originalDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'navigator')
    }
  }
})

test('getOpenApiErrorMessage should format tool-iterations-exhausted with explicit iteration limit', () => {
  const result = getOpenApiErrorMessage({
    details: 'tool-iterations-exhausted',
    iterationLimit: 7,
    type: 'error',
  })

  expect(result).toBe(
    'OpenAI request ended after 7 tool-call rounds without a final assistant response. This usually means the model got stuck in a tool loop. Please try rephrasing your request, reducing scope, or switching to a different model.',
  )
})

test('getOpenApiErrorMessage should format tool-iterations-exhausted with zero iteration limit', () => {
  const result = getOpenApiErrorMessage({
    details: 'tool-iterations-exhausted',
    iterationLimit: 0,
    type: 'error',
  })

  expect(result).toBe(
    'OpenAI request ended after 0 tool-call rounds without a final assistant response. This usually means the model got stuck in a tool loop. Please try rephrasing your request, reducing scope, or switching to a different model.',
  )
})

test('getOpenApiErrorMessage should default tool-iterations-exhausted to the default round limit', () => {
  const result = getOpenApiErrorMessage({
    details: 'tool-iterations-exhausted',
    type: 'error',
  })

  expect(result).toBe(
    `OpenAI request ended after ${defaultMaxToolCalls} tool-call rounds without a final assistant response. This usually means the model got stuck in a tool loop. Please try rephrasing your request, reducing scope, or switching to a different model.`,
  )
})

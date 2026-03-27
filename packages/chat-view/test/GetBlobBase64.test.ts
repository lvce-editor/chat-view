import { expect, test } from '@jest/globals'
import { getBlobBase64 } from '../src/parts/GetBlobBase64/GetBlobBase64.ts'

test('getBlobBase64 returns base64 for blobs', async () => {
  const result = await getBlobBase64(new Blob(['hello']))

  expect(result).toBe('aGVsbG8=')
})

test('getBlobBase64 falls back to browser encoding when Buffer is unavailable', async () => {
  const bytes = new Uint8Array(0x80_01)
  bytes[0] = 104
  bytes[1] = 105
  bytes[bytes.length - 1] = 33
  const originalBuffer = globalThis.Buffer
  const expected = originalBuffer.from(bytes).toString('base64')

  Object.defineProperty(globalThis, 'Buffer', {
    configurable: true,
    value: undefined,
    writable: true,
  })

  try {
    const result = await getBlobBase64(new Blob([bytes]))

    expect(result).toBe(expected)
  } finally {
    Object.defineProperty(globalThis, 'Buffer', {
      configurable: true,
      value: originalBuffer,
      writable: true,
    })
  }
})

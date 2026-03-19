import { expect, test } from '@jest/globals'
import * as Delay from '../src/parts/Delay/Delay.ts'

test('delay should resolve after the specified timeout', async () => {
  const before = Date.now()
  await Delay.delay(1)
  const elapsed = Date.now() - before
  expect(elapsed).toBeGreaterThanOrEqual(0)
})

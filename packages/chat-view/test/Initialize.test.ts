import { expect, test } from '@jest/globals'
import * as Initialize from '../src/parts/Initialize/Initialize.ts'

test('initialize should be awaitable', async () => {
  await expect(Initialize.initialize()).resolves.toBeUndefined()
})

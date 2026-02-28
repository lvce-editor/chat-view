import { expect, test } from '@jest/globals'
import * as HandleClickSettings from '../src/parts/HandleClickSettings/HandleClickSettings.ts'

test.skip('handleClickSettings should resolve', async () => {
  await expect(HandleClickSettings.handleClickSettings()).resolves.toBeUndefined()
})

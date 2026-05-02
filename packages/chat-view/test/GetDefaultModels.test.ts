import { expect, test } from '@jest/globals'
import * as GetDefaultModels from '../src/parts/GetDefaultModels/GetDefaultModels.ts'

test('getDefaultModels should resolve to the same models as the synchronous helper', async () => {
  const result = await GetDefaultModels.getDefaultModels()

  expect(result).toEqual(GetDefaultModels.getDefaultModelsSync())
})

import { expect, test } from '@jest/globals'
import * as MockOpenApiStream from '../src/parts/MockOpenApiStream/MockOpenApiStream.ts'

test('MockOpenApiStream should keep named pending requests isolated', async () => {
  MockOpenApiStream.reset()
  MockOpenApiStream.reset('request-1')
  MockOpenApiStream.reset('request-2')

  const firstRequestId = MockOpenApiStream.startRequest()
  const secondRequestId = MockOpenApiStream.startRequest()

  expect(firstRequestId).toBe('request-1')
  expect(secondRequestId).toBe('request-2')

  const firstChunkPromise = MockOpenApiStream.readNextChunk(firstRequestId)
  const secondChunkPromise = MockOpenApiStream.readNextChunk(secondRequestId)

  MockOpenApiStream.pushChunk('first-response', firstRequestId)
  MockOpenApiStream.pushChunk('second-response', secondRequestId)

  await expect(firstChunkPromise).resolves.toBe('first-response')
  await expect(secondChunkPromise).resolves.toBe('second-response')

  const firstDonePromise = MockOpenApiStream.readNextChunk(firstRequestId)
  const secondDonePromise = MockOpenApiStream.readNextChunk(secondRequestId)

  MockOpenApiStream.finish(firstRequestId)
  MockOpenApiStream.finish(secondRequestId)

  await expect(firstDonePromise).resolves.toBeUndefined()
  await expect(secondDonePromise).resolves.toBeUndefined()
})

test('MockOpenApiStream should keep the default stream behavior', async () => {
  MockOpenApiStream.reset()
  MockOpenApiStream.pushChunk('Hello')
  MockOpenApiStream.finish()

  const requestId = MockOpenApiStream.startRequest()

  expect(requestId).toBe('default')
  await expect(MockOpenApiStream.readNextChunk(requestId)).resolves.toBe('Hello')
  await expect(MockOpenApiStream.readNextChunk(requestId)).resolves.toBeUndefined()
})

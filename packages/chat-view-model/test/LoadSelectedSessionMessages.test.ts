import { expect, test } from '@jest/globals'
import { ChatStorageWorker } from '@lvce-editor/rpc-registry'
import { loadSelectedSessionMessages } from '../src/parts/LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'

test('loadSelectedSessionMessages hydrates the selected summary session with stored messages', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async () => ({
      id: 'session-1',
      messages: [{ id: 'message-1', role: 'user', text: 'hello', time: '10:00' }],
      title: 'Chat 1',
    }),
  })

  const result = await loadSelectedSessionMessages(
    [{ id: 'session-1', messages: [], projectId: 'project-1', status: 'finished', title: 'Chat 1' }],
    'session-1',
  )

  expect(result).toEqual([
    {
      id: 'session-1',
      lastActiveTime: '10:00',
      messages: [{ id: 'message-1', role: 'user', text: 'hello', time: '10:00' }],
      projectId: 'project-1',
      status: 'finished',
      title: 'Chat 1',
    },
  ])
  expect(mockStorageRpc.invocations).toEqual([['ChatStorage.getSession', 'session-1']])
})

test('loadSelectedSessionMessages appends the loaded session when it is missing from the summary list', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async () => ({
      id: 'session-2',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello', time: '10:00' },
        { id: 'message-2', role: 'assistant', text: 'world', time: '10:01' },
      ],
      title: 'Chat 2',
    }),
  })

  const result = await loadSelectedSessionMessages([{ id: 'session-1', messages: [], title: 'Chat 1' }], 'session-2')

  expect(result).toEqual([
    { id: 'session-1', messages: [], title: 'Chat 1' },
    {
      id: 'session-2',
      lastActiveTime: '10:01',
      messages: [
        { id: 'message-1', role: 'user', text: 'hello', time: '10:00' },
        { id: 'message-2', role: 'assistant', text: 'world', time: '10:01' },
      ],
      title: 'Chat 2',
    },
  ])
  expect(mockStorageRpc.invocations).toEqual([['ChatStorage.getSession', 'session-2']])
})

test('loadSelectedSessionMessages normalizes stored messages with multi-part content', async () => {
  using mockStorageRpc = ChatStorageWorker.registerMockRpc({
    'ChatStorage.getSession': async () => ({
      id: 'session-1',
      messages: [
        {
          content: [
            { text: 'hello', type: 'input_text' },
            { image_url: 'data:image/png;base64,abc', type: 'input_image' },
            { text: ' world', type: 'input_text' },
          ],
          id: 'message-1',
          role: 'user',
          time: '10:00',
        },
      ],
      title: 'Chat 1',
    }),
  })

  const result = await loadSelectedSessionMessages([{ id: 'session-1', messages: [], title: 'Chat 1' }], 'session-1')

  expect(result).toEqual([
    {
      id: 'session-1',
      lastActiveTime: '10:00',
      messages: [
        {
          content: [
            { text: 'hello', type: 'input_text' },
            { image_url: 'data:image/png;base64,abc', type: 'input_image' },
            { text: ' world', type: 'input_text' },
          ],
          id: 'message-1',
          role: 'user',
          text: 'hello world',
          time: '10:00',
        },
      ],
      title: 'Chat 1',
    },
  ])
  expect(mockStorageRpc.invocations).toEqual([['ChatStorage.getSession', 'session-1']])
})

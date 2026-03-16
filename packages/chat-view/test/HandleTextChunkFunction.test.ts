import { expect, test } from '@jest/globals'
import type { ChatSession } from '../src/parts/ChatState/ChatState.ts'
import { updateMessageToolCallsInSelectedSession } from '../src/parts/HandleTextChunkFunction/HandleTextChunkFunction.ts'

test('updateMessageToolCallsInSelectedSession should append multiple tool calls across chunks', () => {
  const sessions: readonly ChatSession[] = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-1',
          role: 'assistant',
          text: '',
          time: '10:00',
        },
      ],
      title: 'Chat 1',
    },
  ]

  const firstUpdate = updateMessageToolCallsInSelectedSession(sessions, [], 'session-1', 'message-1', [
    {
      arguments: '{"path":"a.txt"}',
      id: 'call_1',
      name: 'read_file',
    },
  ])
  const secondUpdate = updateMessageToolCallsInSelectedSession(firstUpdate.sessions, firstUpdate.parsedMessages, 'session-1', 'message-1', [
    {
      arguments: '{"path":"b.txt"}',
      id: 'call_2',
      name: 'read_file',
    },
  ])

  expect(secondUpdate.sessions[0].messages[0].toolCalls).toEqual([
    {
      arguments: '{"path":"a.txt"}',
      id: 'call_1',
      name: 'read_file',
    },
    {
      arguments: '{"path":"b.txt"}',
      id: 'call_2',
      name: 'read_file',
    },
  ])
})

test('updateMessageToolCallsInSelectedSession should update existing tool call by id', () => {
  const sessions: readonly ChatSession[] = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-1',
          role: 'assistant',
          text: '',
          time: '10:00',
        },
      ],
      title: 'Chat 1',
    },
  ]

  const firstUpdate = updateMessageToolCallsInSelectedSession(sessions, [], 'session-1', 'message-1', [
    {
      arguments: '{"path":"a.txt"}',
      id: 'call_1',
      name: 'read_file',
    },
  ])
  const secondUpdate = updateMessageToolCallsInSelectedSession(firstUpdate.sessions, firstUpdate.parsedMessages, 'session-1', 'message-1', [
    {
      arguments: '{"path":"a.txt"}',
      id: 'call_1',
      name: 'read_file',
      status: 'success',
    },
  ])

  expect(secondUpdate.sessions[0].messages[0].toolCalls).toEqual([
    {
      arguments: '{"path":"a.txt"}',
      id: 'call_1',
      name: 'read_file',
      status: 'success',
    },
  ])
})

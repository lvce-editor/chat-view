import { expect, test } from '@jest/globals'
import * as ParseMessageContent from '../src/parts/ParseMessageContent/ParseMessageContent.ts'

test('parseMessageContent should parse mixed paragraph and ordered list blocks', () => {
  const rawMessage = [
    'I have access to the following tools:',
    '',
    '1. functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder.',
    '2. functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder.',
    '3. functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder.',
    '',
    'I can also use these tools in parallel when appropriate.',
  ].join('\n')

  const result = ParseMessageContent.parseMessageContent(rawMessage)

  expect(result).toEqual([
    {
      text: 'I have access to the following tools:',
      type: 'text',
    },
    {
      items: [
        {
          text: 'functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder.',
          type: 'list-item',
        },
        {
          text: 'functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder.',
          type: 'list-item',
        },
        {
          text: 'functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder.',
          type: 'list-item',
        },
      ],
      type: 'list',
    },
    {
      text: 'I can also use these tools in parallel when appropriate.',
      type: 'text',
    },
  ])
})

test('parseMessageContent should return a text node for empty messages', () => {
  const result = ParseMessageContent.parseMessageContent('')

  expect(result).toEqual([
    {
      text: '',
      type: 'text',
    },
  ])
})

import { expect, test } from '@jest/globals'
import * as ParseMessageContent from '../src/parts/ParseMessageContent/ParseMessageContent.ts'

test('parseMessageContent should parse mixed paragraph and ordered list blocks', () => {
  const rawMessage = [
    'I have access to the following tools:',
    '',
    '1. functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI.',
    '2. functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder.',
    '3. functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder.',
    '',
    'I can also use these tools in parallel when appropriate.',
  ].join('\n')

  const result = ParseMessageContent.parseMessageContent(rawMessage)

  expect(result).toEqual([
    {
      children: [
        {
          text: 'I have access to the following tools:',
          type: 'text',
        },
      ],
      type: 'text',
    },
    {
      items: [
        {
          children: [
            {
              text: 'functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI.',
              type: 'text',
            },
          ],
          type: 'list-item',
        },
        {
          children: [
            {
              text: 'functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder.',
              type: 'text',
            },
          ],
          type: 'list-item',
        },
        {
          children: [
            {
              text: 'functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder.',
              type: 'text',
            },
          ],
          type: 'list-item',
        },
      ],
      type: 'list',
    },
    {
      children: [
        {
          text: 'I can also use these tools in parallel when appropriate.',
          type: 'text',
        },
      ],
      type: 'text',
    },
  ])
})

test('parseMessageContent should return a text node for empty messages', () => {
  const result = ParseMessageContent.parseMessageContent('')

  expect(result).toEqual([
    {
      children: [
        {
          text: '',
          type: 'text',
        },
      ],
      type: 'text',
    },
  ])
})

test('parseMessageContent should parse markdown links in paragraphs and lists', () => {
  const rawMessage = [
    'Forecast source: [source one](https://example.com/forecast?location=paris)',
    '',
    '1. Climate normals: [source two](https://example.org/climate/paris-march)',
  ].join('\n')

  const result = ParseMessageContent.parseMessageContent(rawMessage)

  expect(result).toEqual([
    {
      children: [
        {
          text: 'Forecast source: ',
          type: 'text',
        },
        {
          href: 'https://example.com/forecast?location=paris',
          text: 'source one',
          type: 'link',
        },
      ],
      type: 'text',
    },
    {
      items: [
        {
          children: [
            {
              text: 'Climate normals: ',
              type: 'text',
            },
            {
              href: 'https://example.org/climate/paris-march',
              text: 'source two',
              type: 'link',
            },
          ],
          type: 'list-item',
        },
      ],
      type: 'list',
    },
  ])
})

test('parseMessageContent should parse markdown bold text in paragraphs', () => {
  const rawMessage =
    'For **Transport Agnostic**: It can work over various transport protocols, including HTTP, WebSocket, and others.'

  const result = ParseMessageContent.parseMessageContent(rawMessage)

  expect(result).toEqual([
    {
      children: [
        {
          text: 'For ',
          type: 'text',
        },
        {
          text: 'Transport Agnostic',
          type: 'bold',
        },
        {
          text: ': It can work over various transport protocols, including HTTP, WebSocket, and others.',
          type: 'text',
        },
      ],
      type: 'text',
    },
  ])
})

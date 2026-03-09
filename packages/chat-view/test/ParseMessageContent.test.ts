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
    'Forecast source: [metcheck.com](https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai)',
    '',
    '1. Climate normals: [weather2visit.com](https://www.weather2visit.com/europe/france/paris-march.htm?utm_source=openai)',
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
          href: 'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
          text: 'metcheck.com',
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
              href: 'https://www.weather2visit.com/europe/france/paris-march.htm?utm_source=openai',
              text: 'weather2visit.com',
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

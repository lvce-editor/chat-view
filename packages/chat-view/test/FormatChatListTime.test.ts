import { afterEach, expect, test } from '@jest/globals'
import * as FormatChatListTime from '../src/parts/FormatChatListTime/FormatChatListTime.ts'
import * as RelativeTimeNow from '../src/parts/RelativeTimeNow/RelativeTimeNow.ts'

afterEach(() => {
  RelativeTimeNow.resetRelativeTimeNowForTest()
})

test('formatChatListTime should keep plain message times unchanged', () => {
  expect(FormatChatListTime.formatChatListTime('10:30')).toBe('10:30')
})

test('formatChatListTime should format iso timestamps with vscode-style short labels', () => {
  const now = Date.parse('2026-04-14T12:00:00.000Z')
  RelativeTimeNow.setRelativeTimeNowForTest(now)

  expect(FormatChatListTime.formatChatListTime(new Date(now - 1_000).toISOString())).toBe('1 sec ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 10_000).toISOString())).toBe('10 secs ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 60_000).toISOString())).toBe('1 min ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 10 * 60_000).toISOString())).toBe('10 mins ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 60 * 60_000).toISOString())).toBe('1 hr ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 10 * 60 * 60_000).toISOString())).toBe('10 hrs ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 24 * 60 * 60_000).toISOString())).toBe('1 day ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 10 * 24 * 60 * 60_000).toISOString())).toBe('10 days ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 30 * 24 * 60 * 60_000).toISOString())).toBe('1 mo ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 10 * 30 * 24 * 60 * 60_000).toISOString())).toBe('10 mos ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 365 * 24 * 60 * 60_000).toISOString())).toBe('1 yr ago')
  expect(FormatChatListTime.formatChatListTime(new Date(now - 10 * 365 * 24 * 60 * 60_000).toISOString())).toBe('10 yrs ago')
})

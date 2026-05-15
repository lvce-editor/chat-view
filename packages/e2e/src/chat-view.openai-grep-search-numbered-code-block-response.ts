import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-grep-search-numbered-code-block-response'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-grep-search-numbered-code-block-response', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'use your grep tool to search for "hello"',
      time: '03:13 PM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: [
        'I found several occurrences of the word "hello" (or similar) in the project files:',
        '',
        '1. languages/index.kt at line 2:',
        '```kotlin',
        'println("Hello, World!")',
        '```',
        '',
        '2. languages/index.java at line 1 and 3:',
        '```java',
        'class HelloWorld {',
        '      System.out.println("Hello, World!");',
        '}',
        '```',
        '',
        '3. languages/index.pl at line 10:',
        '```perl',
        'print "Hello, World\\n"',
        '```',
        '',
        '4. languages/index.dart at line 2:',
        '```dart',
        "print('Hello, World!');",
        '```',
        '',
        '5. languages/index.html at line 1:',
        '```html',
        '<h1 class="abc">hello world</h1>',
        '```',
        '',
        'Would you like to view or edit any of these files or lines?',
      ].join('\n'),
      time: '03:13 PM',
      toolCalls: [
        {
          arguments: '{"includeIgnoredFiles":false,"includePattern":"**","isRegexp":false,"maxResults":10,"query":"hello"}',
          id: 'call_01',
          name: 'grep_search',
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText('use your grep tool to search for "hello"')

  const toolCallMessage = messages.nth(1)
  await expect(toolCallMessage.locator('.ChatOrderedListItem')).toHaveCount(1)
  await expect(toolCallMessage).toContainText('grep_search')
  await expect(toolCallMessage).toContainText('"query":"hello"')

  const assistantReply = messages.nth(2)
  const orderedLists = assistantReply.locator('.ChatMessageContent > ol')
  const orderedItems = assistantReply.locator('.ChatMessageContent > ol > li')
  const codeBlocks = assistantReply.locator('pre code')

  await expect(orderedLists).toHaveCount(5)
  await expect(orderedItems).toHaveCount(5)
  await expect(codeBlocks).toHaveCount(5)
  await expect(assistantReply).toContainText('I found several occurrences of the word "hello"')
  await expect(assistantReply).toContainText('Would you like to view or edit any of these files or lines?')
  const orderedItem0 = orderedItems.nth(0)
  await expect(orderedItem0).toContainText('languages/index.kt at line 2:')
  const orderedItem1 = orderedItems.nth(1)
  await expect(orderedItem1).toContainText('languages/index.java at line 1 and 3:')
  const codeBlock0 = codeBlocks.nth(0)
  await expect(codeBlock0).toHaveText('println("Hello, World!")')
  const codeBlock1 = codeBlocks.nth(1)
  await expect(codeBlock1).toContainText('class HelloWorld {')
  const codeBlock2 = codeBlocks.nth(2)
  await expect(codeBlock2).toContainText('print "Hello, World')
  const codeBlock3 = codeBlocks.nth(3)
  await expect(codeBlock3).toHaveText("print('Hello, World!');")
  const codeBlock4 = codeBlocks.nth(4)
  await expect(codeBlock4).toHaveText('<h1 class="abc">hello world</h1>')
}

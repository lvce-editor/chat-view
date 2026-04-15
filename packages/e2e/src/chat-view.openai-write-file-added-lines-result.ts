import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-added-lines-result'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()

  await Command.execute('Chat.openMockSession', 'session-openai-write-file-added-lines-result', [
    {
      id: 'message-user-1',
      role: 'user',
      text: 'create styles.css',
      time: '11:50 AM',
    },
    {
      id: 'message-assistant-1',
      inProgress: false,
      role: 'assistant',
      text: 'Created the stylesheet.',
      time: '11:50 AM',
      toolCalls: [
        {
          arguments: JSON.stringify({
            content:
              'body {\n font-family: Arial, sans-serif;\n display: flex;\n flex-direction: column;\n align-items: center;\n background-color: #f0f0f0;\n margin: 0;\n padding: 20px;\n}\n\n.game-container {\n text-align: center;\n}\n\n#board {\n display: grid;\n grid-template-columns: repeat(5, 50px);\n gap: 5px;\n margin: 20px 0;\n}\n\n.cell {\n width: 50px;\n height: 50px;\n border: 2px solid #ccc;\n display: flex;\n align-items: center;\n justify-content: center;\n font-size: 24px;\n background-color: white;\n}\n\n.correct {\n background-color: #6aaa64;\n border: 2px solid #6aaa64;\n}\n\n.wrong {\n background-color: #c9c9c9;\n}\n\n#message {\n margin-top: 20px;\n font-size: 18px;\n}',
            uri: 'file:///home/simon/Documents/fib/styles.css',
          }),
          id: 'call_01',
          name: 'write_file',
          result: JSON.stringify({
            addedLines: 45,
            linesAdded: 0,
            linesDeleted: 0,
            ok: true,
            removedLines: 0,
            uri: 'file:///home/simon/Documents/fib/styles.css',
          }),
          status: 'success',
        },
      ],
    },
  ])

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(3)
  await expect(messages.nth(0)).toHaveText('create styles.css')
  await expect(messages.nth(1)).toContainText('write_file styles.css +45 -0')
  await expect(messages.nth(2)).toHaveText('Created the stylesheet.')
}

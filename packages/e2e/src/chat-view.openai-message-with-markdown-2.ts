/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-streaming-function-tool-call-mock'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setStreamingEnabled', true)
  await Command.execute('Chat.useMockApi', true)
  await Command.execute('Chat.handleModelChange', 'openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const sseResponseParts = [
    {
      eventId: 121,
      inProgress: false,
      messageId: '0618fa4e-5860-41e5-bf5f-5f43375cd043',
      sessionId: 'ab10c0d9-bf04-4f6e-a31a-7dd7788c49ad',
      text: `JSON-RPC is a remote procedure call (RPC) protocol encoded in JSON. It allows for communication between a client and a server where the client can invoke methods on the server using a straightforward JSON-based message format.

### Key Features:

**Lightweight**: JSON-RPC is simple and efficient, making it easy to implement.
**Transport Agnostic**: It can work over various transport protocols, including HTTP, WebSocket, and others.
**Asynchronous**: Supports both synchronous and asynchronous communication.
**Bidirectional**: The server can send notifications to the client without a request.
### Basic Structure:

A JSON-RPC message consists of: - **jsonrpc**: A string specifying the version of the JSON-RPC protocol (usually "2.0"). - **method**: A string representing the name of the method to be invoked. - **params**: An optional list or object containing parameters for the method. - **id**: An identifier used to match responses to requests.

### Example Request:

\`\`\`json { "jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1 } \`\`\`

### Example Response:

\`\`\`json { "jsonrpc": "2.0", "result": 19, "id": 1 } \`\`\`

### Error Handling:

JSON-RPC includes a standardized error response structure for handling issues, providing an error code and message with a response ID for tracking.

### Use Cases:

- Web services - Distributed systems - Microservices communication

Overall, JSON-RPC is widely used for implementing APIs due to its simplicity and versatility.`,
      time: '03:15 PM',
      timestamp: '2026-03-09T14:15:54.246Z',
      type: 'chat-message-updated',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Command.execute('Chat.handleInput', 'composer', 'whats jsonrpc', 'script')
  await Command.execute('Chat.handleSubmit')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('whats jsonrpc')
  await expect(messages.nth(1)).toHaveText('toolsread_file index.html')
}

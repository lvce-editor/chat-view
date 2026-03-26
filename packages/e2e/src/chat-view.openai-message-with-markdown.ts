/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-streaming-function-tool-call-mock'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const sseResponseParts = [
    {
      eventId: 121,
      inProgress: false,
      messageId: '0618fa4e-5860-41e5-bf5f-5f43375cd043',
      sessionId: 'ab10c0d9-bf04-4f6e-a31a-7dd7788c49ad',
      text: 'As of 3:15 PM local time on Monday, March 9, 2026, in Paris, France, the current weather is mostly cloudy with a temperature of 62°F (17°C).\n\n## Weather for Paris, Paris, France:\nCurrent Conditions: Mostly cloudy, 62°F (17°C)\n\nDaily Forecast:\n* Monday, March 9: Low: 48°F (9°C), High: 66°F (19°C), Description: Sunny to partly cloudy with a couple of showers this afternoon\n* Tuesday, March 10: Low: 49°F (10°C), High: 62°F (16°C), Description: Some sun, then turning cloudy with a brief shower or two in the afternoon\n* Wednesday, March 11: Low: 40°F (5°C), High: 56°F (13°C), Description: Mostly cloudy; morning showers followed by occasional rain and drizzle in the afternoon\n* Thursday, March 12: Low: 49°F (10°C), High: 56°F (14°C), Description: Mostly cloudy\n* Friday, March 13: Low: 40°F (5°C), High: 52°F (11°C), Description: A little morning rain; otherwise, cloudy and breezy\n* Saturday, March 14: Low: 40°F (4°C), High: 54°F (12°C), Description: Mostly cloudy with a little rain\n* Sunday, March 15: Low: 40°F (4°C), High: 56°F (13°C), Description: Considerable cloudiness with a shower in spots\n\n\nPlease note that weather conditions can change rapidly. For the most accurate and up-to-date information, consider checking a reliable local weather service. ',
      time: '03:15 PM',
      timestamp: '2026-03-09T14:15:54.246Z',
      type: 'chat-message-updated',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Chat.mockOpenApiStreamPushChunk(`data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()

  await Chat.handleInput('weather in paris, france')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('weather in paris, france')
  await expect(messages.nth(1)).toHaveText('toolsread_file index.html')
}

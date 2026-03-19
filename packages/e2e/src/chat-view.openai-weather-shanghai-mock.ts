import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-weather-shanghai-mock'

export const skip = 1

const shanghaiWeatherResponse = {
  eventId: 188,
  inProgress: false,
  messageId: '3541edf0-4c28-46b7-983f-43e98d543b98',
  sessionId: '7c516408-fbef-4553-a2bb-61395e7a6af3',
  text: `As of 1:12 AM local time in Shanghai, the current weather is partly cloudy with a temperature of 16°C (61°F).

## 上海市 的天气：
当前状况：多云，46°F (8°C)

每日预报：
* 星期四, 三月 19：低温：44°F (7°C)，高温：56°F (14°C)，描述：部分晴
* 星期五, 三月 20：低温：46°F (8°C)，高温：58°F (14°C)，描述：大部分多云
* 星期六, 三月 21：低温：50°F (10°C)，高温：59°F (15°C)，描述：大部分多云
* 星期日, 三月 22：低温：53°F (12°C)，高温：65°F (18°C)，描述：云量增加，下午有阵雨
* 星期一, 三月 23：低温：51°F (10°C)，高温：60°F (16°C)，描述：多云
* 星期二, 三月 24：低温：50°F (10°C)，高温：55°F (13°C)，描述：上午有少量降雨；多云
* 星期三, 三月 25：低温：51°F (11°C)，高温：61°F (16°C)，描述：部分晴


  Please note that weather conditions can change rapidly; for the most accurate and up-to-date information, consider checking a reliable local weather service. `,
  time: '06:12 PM',
  timestamp: '2026-03-19T17:12:57.382Z',
  type: 'chat-message-updated',
} as const

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(shanghaiWeatherResponse)}\n\n`)
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Chat.handleInput('weather in shanghai')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('weather in shanghai')
  await expect(messages.nth(1)).toContainText('As of 1:12 AM local time in Shanghai')
  await expect(messages.nth(1)).toContainText('## 上海市 的天气：')
  await expect(messages.nth(1)).toContainText('星期四, 三月 19')
  await expect(messages.nth(1)).toContainText('Please note that weather conditions can change rapidly')
}

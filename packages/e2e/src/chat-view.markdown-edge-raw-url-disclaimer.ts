/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.raw-url-disclaimer'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: '(DISCLAIMER: "Information provided on METEOALARM for Italy regard only the intensity and recurrence of the phenomena, further details can be found at www.meteoam.it. METEOALARM information do not provide the assessment of impact on the territory and they do not represent the Official Alerts messages that are issued by the National Civil Protection Service https://www.protezionecivile.gov.it")BE AWARE, keep up to date with the latest weather forecast. Expect some minor disruption to outdoor activities, start time: Wednesday, March 18, 01:00:00 UTC, end time: Thursday, March 19, 23:59:00 UTC',
  })
  await Chat.handleInput('weather disclaimer')

  await Chat.handleSubmit()
  await Command.execute('Chat.rerender')

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const links = Locator('.ChatMessages .Message a')
  await expect(links).toHaveCount(1)
  await expect(links).toHaveAttribute('href', 'https://www.protezionecivile.gov.it')
}

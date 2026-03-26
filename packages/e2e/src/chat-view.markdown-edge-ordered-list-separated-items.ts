/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.ordered-list-separated-items'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', {
    text: "Madeira, a beautiful Portuguese archipelago, offers a range of activities and attractions:\n\n1. **Levada Walks**: Explore the famous levadas (irrigation channels) with stunning hiking trails such as Levada do Caldeir\u00E3o Verde.\n\n2. **Funchal**: Visit the capital city for its botanical gardens, the Mercado dos Lavradores (farmers market), and the beautiful marina.\n\n3. **Pico do Arieiro**: Hike to this peak for breathtaking views; it\u2019s one of the highest points on the island.\n\n4. **Cabo Gir\u00E3o**: Check out the skywalk at one of the highest sea cliffs in Europe for panoramic views.\n\n5. **Santana**: Discover traditional A-framed houses and picturesque landscapes.\n\n6. **Wine Tasting**: Sample Madeira wine at local vineyards and wineries.\n\n7. **Whale and Dolphin Watching**: Take a boat tour to see these incredible marine animals in their natural habitat.\n\n8. **Scenic Drives**: Explore the island\u2019s beautiful coastlines and mountains by car, visiting places like Ponta de S\u00E3o Louren\u00E7o.\n\n9. **Madeira Theme Park**: Located in Santana, it\u2019s great for families and showcases the island's nature, history, and traditions.\n\n10. **Relax on the beaches**: Visit the black sand and pebble beaches like Praia Formosa.\n\nEach season offers its own charm, so you\u2019ll find plenty to do year-round!",
  })
  await Chat.handleInput('what can I do in Madeira?')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const topLevelOrdered = Locator('.ChatMessages .Message .ChatMessageContent > ol')
  const orderedItems = Locator('.ChatMessages .Message .ChatMessageContent > ol > li')
  await expect(topLevelOrdered).toHaveCount(1)
  await expect(orderedItems).toHaveCount(10)
}

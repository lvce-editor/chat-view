import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.image-invalid-url-placeholder'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: '![This is an image](http://invalid-url)' })
  await Chat.handleInput('show markdown image')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const images = Locator('.ChatMessages .Message img')
  await expect(images).toHaveCount(1)
  await expect(images).toHaveAttribute('alt', 'This is an image (Image preview could not be loaded)')
  await expect(messages.nth(1)).toContainText('Image preview could not be loaded')
}

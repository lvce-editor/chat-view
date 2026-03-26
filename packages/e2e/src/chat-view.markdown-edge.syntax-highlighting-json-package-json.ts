import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.markdown-edge.syntax-highlighting-json-package-json'

const mockResponse = `I will create a new package.json file suitable for a new React project. It will include the basic dependencies for React and ReactDOM.

Here is a basic example for a React project:

\`\`\`json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "description": "A new React project",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "keywords": [
    "react",
    "javascript",
    "frontend"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
\`\`\`

Should I create this package.json file for you with this content? If you want any customization like project name or author, please let me know.`

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.registerMockResponse', { text: mockResponse })
  await Chat.handleInput('create a package.json for react')
  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const codeBlocks = Locator('.ChatMessages .Message pre code')
  const jsonProperties = Locator('.ChatMessages .Message pre code .TokenProperty')
  const jsonStrings = Locator('.ChatMessages .Message pre code .TokenString')
  await expect(messages).toHaveCount(2)
  await expect(codeBlocks).toHaveCount(1)
  await expect(jsonProperties).toHaveCount(16)
  await expect(jsonProperties.nth(0)).toHaveText('"name"')
  await expect(jsonProperties.nth(15)).toHaveText('"react-scripts"')
  await expect(jsonStrings).toHaveCount(16)
  await expect(jsonStrings.nth(0)).toHaveText('"my-react-app"')
  await expect(jsonStrings.nth(15)).toHaveText('"5.0.1"')
}

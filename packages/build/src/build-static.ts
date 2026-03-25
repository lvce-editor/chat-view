import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { bundleJs } from './bundleJs.ts'
import { root } from './root.ts'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

await bundleJs()

process.env.PATH_PREFIX = '/chat-view'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const builtinChatViewWorkerPath = join(root, 'dist', commitHash, 'packages', 'chat-view', 'dist', 'chatViewWorkerMain.js')

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const chatViewWorkerPath = join(root, '.tmp/dist/dist/chatViewWorkerMain.js')

const replaceRemoteUrlWithAssetUrl = (
  currentContent: string,
  variableName: string,
  packageName: string,
  workerMainName: string,
  localPath: string,
) => {
  const remoteUrl = getRemoteUrl(localPath)
  const occurrence = `// const ${variableName} = \`\${assetDir}/packages/${packageName}/dist/${workerMainName}\`
const ${variableName} = \`${remoteUrl}\``
  const replacement = `const ${variableName} = \`\${assetDir}/packages/${packageName}/dist/${workerMainName}\``
  if (!currentContent.includes(occurrence)) {
    return currentContent
  }
  return currentContent.replace(occurrence, replacement)
}

let newContent = content
newContent = replaceRemoteUrlWithAssetUrl(newContent, 'chatViewWorkerUrl', 'chat-view', 'chatViewWorkerMain.js', chatViewWorkerPath)

if (newContent === content) {
  throw new Error('occurrence not found')
}
await writeFile(rendererWorkerPath, newContent)

await mkdir(dirname(builtinChatViewWorkerPath), { recursive: true })
await cp(chatViewWorkerPath, builtinChatViewWorkerPath)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })

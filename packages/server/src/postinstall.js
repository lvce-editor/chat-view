import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
const serverStaticPath = join(dirname(staticServerPackagePath), 'static')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const rendererProcessMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const testWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'test-worker', 'dist', 'testWorkerMain.js')
const dragAndDropWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'drag-and-drop-worker', 'dist', 'dragAndDropWorkerMain.js')

const patchDropSessionCommand = (content) => {
  if (content.includes("'TestFrameWork.createDropSession': createDropSession")) {
    return content
  }
  const addDropData =
    /const add\$\d+ = dataTransfer => \{\n  const id = (create\$\w+)\(\);\n  (state\$\w+)\[id\] = retainItems\(dataTransfer\);\n  return id;\n\};/
  const match = content.match(addDropData)
  if (!match) {
    throw new Error('renderer process drop data store not found')
  }
  const [, createId, dropDataState] = match
  const createWorkerWithPort = content.match(
    /const (create\$\w+) = async \(\{\n  commandMap,\n  name,\n  port,\n  url\n\}\) => \{[\s\S]*?await workerRpc\.invokeAndTransfer\('initialize', 'message-port', port\);/,
  )?.[1]
  const createMessagePortRpc = content.match(
    /const (create\$\w+) = async \(\{\n  commandMap,\n  isMessagePortOpen = true,\n  messagePort\n\}\) => \{/,
  )?.[1]
  if (!createWorkerWithPort || !createMessagePortRpc) {
    throw new Error('renderer process worker rpc factories not found')
  }
  const implementation = `const retainTestDropItem = (item, index) => {
  if (item.kind === 'string') {
    return { index, kind: 'string', type: item.type, value: Promise.resolve(item.value) };
  }
  return { file: item.file ?? null, fileSystemHandle: Promise.resolve(item.fileSystemHandle), index, kind: 'file', type: item.type };
};
const createDropSession = items => {
  const id = ${createId}();
  ${dropDataState}[id] = items.map(retainTestDropItem);
  return id;
};
const dragAndDropWorkerUrlForTests = \`\${assetDir}/packages/drag-and-drop-worker/dist/dragAndDropWorkerMain.js\`;
let dragAndDropWorkerRpcForTests;
const handleDragAndDropMessagePort = async port => {
  if (!dragAndDropWorkerRpcForTests) {
    const { port1, port2 } = new MessageChannel();
    await ${createWorkerWithPort}({ commandMap: {}, name: 'Drag And Drop Worker', port: port1, url: dragAndDropWorkerUrlForTests });
    dragAndDropWorkerRpcForTests = await ${createMessagePortRpc}({ commandMap: commandMapRef, messagePort: port2 });
  }
  await dragAndDropWorkerRpcForTests.invokeAndTransfer('DragAndDrop.handleMessagePort', port);
};

`
  const command = "  'TestFrameWork.checkSingleElementCondition': checkSingleElementCondition,\n"
  if (!content.includes(command)) {
    throw new Error('renderer process test command map not found')
  }
  return content
    .replace('const commandMap = {', implementation + 'const commandMap = {')
    .replace("  'DropData.get':", "  'DragAndDrop.handleMessagePort': handleDragAndDropMessagePort,\n  'DropData.get':")
    .replace(command, command + "  'TestFrameWork.createDropSession': createDropSession,\n")
}

const rendererProcessContent = await readFile(rendererProcessMainPath, 'utf-8')
const patchedRendererProcessContent = patchDropSessionCommand(rendererProcessContent)
if (patchedRendererProcessContent !== rendererProcessContent) {
  await writeFile(rendererProcessMainPath, patchedRendererProcessContent)
}

const content = await readFile(rendererWorkerMainPath, 'utf-8')

const chatViewWorkerPath = join(root, '.tmp/dist/dist/chatViewWorkerMain.js')
const chatViewModelWorkerPath = join(root, '.tmp/dist-chat-view-model/dist/chatViewModelWorkerMain.js')

const replaceWorkerUrl = (currentContent, variableName, packageName, workerMainName, localPath) => {
  const remoteUrl = getRemoteUrl(localPath)
  const occurrence = `const ${variableName} = \`\${assetDir}/packages/${packageName}/dist/${workerMainName}\``
  const replacement = `// const ${variableName} = \`\${assetDir}/packages/${packageName}/dist/${workerMainName}\`
const ${variableName} = \`${remoteUrl}\``
  if (!currentContent.includes(occurrence)) {
    return currentContent
  }
  return currentContent.replace(occurrence, replacement)
}

let newContent = content
newContent = replaceWorkerUrl(newContent, 'chatViewWorkerUrl', 'chat-view', 'chatViewWorkerMain.js', chatViewWorkerPath)
newContent = replaceWorkerUrl(newContent, 'chatViewModelWorkerUrl', 'chat-view-model', 'chatViewModelWorkerMain.js', chatViewModelWorkerPath)

if (newContent !== content) {
  await cp(rendererWorkerMainPath, rendererWorkerMainPath + '.original')
  await writeFile(rendererWorkerMainPath, newContent)
}

const dragAndDropWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/drag-and-drop-worker/package.json'))
await cp(join(dirname(dragAndDropWorkerPackagePath), 'dist', 'dragAndDropWorkerMain.js'), dragAndDropWorkerMainPath)
const testWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/test-worker/package.json'))
await cp(join(dirname(testWorkerPackagePath), 'dist', 'testWorkerMain.js'), testWorkerMainPath)
const testWorkerContent = await readFile(testWorkerMainPath, 'utf-8')
const workspaceReset = /    await invoke[^\n(]*\('FileSystem\.mkdir', 'memfs:\/\/\/workspace'\);\n    await invoke[^\n(]*\('Layout\.reset'\);/
if (!workspaceReset.test(testWorkerContent)) {
  const occurrence = /    await (invoke[^\n(]*)\('Layout\.reset'\);/
  if (!occurrence.test(testWorkerContent)) {
    throw new Error('test worker workspace reset occurrence not found')
  }
  const replacement = `    await $1('FileSystem.remove', 'memfs:///workspace');
    await $1('FileSystem.mkdir', 'memfs:///workspace');
    await $1('Layout.reset');`
  await writeFile(testWorkerMainPath, testWorkerContent.replace(occurrence, replacement))
}

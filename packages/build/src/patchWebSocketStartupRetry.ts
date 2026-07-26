import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const staticRoot = join(root, 'node_modules', '@lvce-editor', 'static-server', 'static', '0f18beb', 'packages')

const replaceExactlyOnce = (content: string, occurrence: string, replacement: string, path: string): string => {
  const firstIndex = content.indexOf(occurrence)
  const lastIndex = content.lastIndexOf(occurrence)
  if (firstIndex === -1 || firstIndex !== lastIndex) {
    throw new Error(`Expected exactly one WebSocket startup patch occurrence in ${path}`)
  }
  return content.replace(occurrence, replacement)
}

const retryDelay = `  await new Promise(resolve => {
    setTimeout(resolve, 2000);
  });`

const rendererWorkerPath = join(staticRoot, 'renderer-worker', 'dist', 'rendererWorkerMain.js')
let rendererWorker = await readFile(rendererWorkerPath, 'utf8')
rendererWorker = replaceExactlyOnce(
  rendererWorker,
  `  const webSocket = create$Y(wsUrl);
  const firstWebSocketEvent = await waitForWebSocketToBeOpen(webSocket);
  if (firstWebSocketEvent.type === Close) {
    throw new IpcError('Websocket connection was immediately closed');
  }
  return webSocket;`,
  `  let webSocket = create$Y(wsUrl);
  let firstWebSocketEvent = await waitForWebSocketToBeOpen(webSocket);
  if (firstWebSocketEvent.type === Close) {
${retryDelay}
    webSocket = create$Y(wsUrl);
    firstWebSocketEvent = await waitForWebSocketToBeOpen(webSocket);
  }
  if (firstWebSocketEvent.type === Close) {
    throw new IpcError('Websocket connection was immediately closed');
  }
  return webSocket;`,
  rendererWorkerPath,
)
await writeFile(rendererWorkerPath, rendererWorker)

const rpcWorkerPatches = [
  {
    path: join(staticRoot, 'file-system-worker', 'dist', 'fileSystemWorkerMain.js'),
    occurrence: `  const webSocket = new WebSocket(wsUrl);
  const rpc = await create$3({
    commandMap,
    webSocket
  });
  return rpc;`,
    replacement: `  let webSocket = new WebSocket(wsUrl);
  try {
    return await create$3({
      commandMap,
      webSocket
    });
  } catch {
${retryDelay}
    webSocket = new WebSocket(wsUrl);
    return create$3({
      commandMap,
      webSocket
    });
  }`,
  },
  {
    path: join(staticRoot, 'extension-management-worker', 'dist', 'extensionManagementWorkerMain.js'),
    occurrence: `  const webSocket = new WebSocket(wsUrl);
  const rpc = await create$5({
    commandMap,
    webSocket
  });
  return rpc;`,
    replacement: `  let webSocket = new WebSocket(wsUrl);
  try {
    return await create$5({
      commandMap,
      webSocket
    });
  } catch {
${retryDelay}
    webSocket = new WebSocket(wsUrl);
    return create$5({
      commandMap,
      webSocket
    });
  }`,
  },
] as const

for (const patch of rpcWorkerPatches) {
  const content = await readFile(patch.path, 'utf8')
  const updated = replaceExactlyOnce(content, patch.occurrence, patch.replacement, patch.path)
  await writeFile(patch.path, updated)
}

process.stdout.write(`Patched WebSocket startup retry\n`)

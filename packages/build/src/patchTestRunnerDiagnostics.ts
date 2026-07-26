import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const workerPath = join(root, 'packages', 'e2e', 'node_modules', '@lvce-editor', 'test-with-playwright-worker', 'dist', 'workerMain.js')

const replaceExactlyOnce = (content: string, occurrence: string, replacement: string, path: string): string => {
  const firstIndex = content.indexOf(occurrence)
  const lastIndex = content.lastIndexOf(occurrence)
  if (firstIndex === -1 || firstIndex !== lastIndex) {
    throw new Error(`Expected exactly one diagnostic patch occurrence in ${path}`)
  }
  return content.replace(occurrence, replacement)
}

const replacements = [
  {
    occurrence: `  const page = await browserInstance.newPage();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises`,
    replacement: `  const page = await browserInstance.newPage();
  page.__diagnosticEvents = [];
  page.__diagnosticWebSocketRequestIds = new Set();
  page.on('websocket', webSocket => {
    page.__diagnosticEvents.push({
      kind: 'playwright-websocket-created',
      url: webSocket.url(),
      wallTime: Date.now()
    });
    webSocket.on('close', () => {
      page.__diagnosticEvents.push({
        kind: 'playwright-websocket-closed',
        url: webSocket.url(),
        wallTime: Date.now()
      });
    });
    webSocket.on('socketerror', error => {
      page.__diagnosticEvents.push({
        error: String(error),
        kind: 'playwright-websocket-error',
        url: webSocket.url(),
        wallTime: Date.now()
      });
    });
  });
  const cdpSession = await page.context().newCDPSession(page);
  await cdpSession.send('Network.enable');
  cdpSession.on('Network.webSocketCreated', event => {
    page.__diagnosticWebSocketRequestIds.add(event.requestId);
    page.__diagnosticEvents.push({
      event,
      kind: 'cdp-websocket-created',
      wallTime: Date.now()
    });
  });
  for (const eventName of [
    'Network.webSocketWillSendHandshakeRequest',
    'Network.webSocketHandshakeResponseReceived',
    'Network.webSocketFrameError',
    'Network.webSocketClosed'
  ]) {
    cdpSession.on(eventName, event => {
      if (page.__diagnosticWebSocketRequestIds.has(event.requestId)) {
        page.__diagnosticEvents.push({
          event,
          kind: eventName,
          wallTime: Date.now()
        });
      }
    });
  }
  cdpSession.on('Network.loadingFailed', event => {
    if (page.__diagnosticWebSocketRequestIds.has(event.requestId)) {
      page.__diagnosticEvents.push({
        event,
        kind: 'Network.loadingFailed',
        wallTime: Date.now()
      });
    }
  });
  page.on('console', message => {
    page.__diagnosticEvents.push({
      kind: 'console',
      text: message.text(),
      type: message.type(),
      wallTime: Date.now()
    });
  });
  page.on('pageerror', error => {
    page.__diagnosticEvents.push({
      kind: 'pageerror',
      message: error.message,
      stack: error.stack,
      wallTime: Date.now()
    });
  });
  page.on('requestfailed', request => {
    if (request.resourceType() === 'document') {
      page.__diagnosticEvents.push({
        failure: request.failure(),
        kind: 'document-request-failed',
        url: request.url(),
        wallTime: Date.now()
      });
    }
  });
  page.on('response', response => {
    if (response.request().resourceType() === 'document') {
      page.__diagnosticEvents.push({
        kind: 'document-response',
        status: response.status(),
        url: response.url(),
        wallTime: Date.now()
      });
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises`,
  },
  {
    occurrence: `  const start = performance.now();
  try {`,
    replacement: `  const start = performance.now();
  page.__diagnosticEvents.length = 0;
  try {`,
  },
  {
    occurrence: `  try {
    const url = getUrlFromTestFile(test, port, traceFocus);
    await page.goto(url, {`,
    replacement: `  try {
    await page.goto('about:blank');
    const url = getUrlFromTestFile(test, port, traceFocus);
    await page.goto(url, {`,
  },
  {
    occurrence: `  } catch (error) {
    const end = performance.now();
    const message = error instanceof Error ? error.message : \`\${error}\`;
    return {`,
    replacement: `  } catch (error) {
    const end = performance.now();
    const message = error instanceof Error ? error.message : \`\${error}\`;
    const { mkdir, writeFile } = await import('node:fs/promises');
    const diagnosticDirectory = join(process.cwd(), '.tmp', 'e2e-diagnostics');
    await mkdir(diagnosticDirectory, {
      recursive: true
    });
    const diagnosticName = basename(test).replaceAll(/[^a-zA-Z0-9.-]/g, '_');
    const attempt = process.env.E2E_ATTEMPT || 'unknown';
    const diagnosticPath = join(diagnosticDirectory, \`diagnostic-\${attempt}-\${diagnosticName}.json\`);
    const screenshotPath = join(diagnosticDirectory, \`diagnostic-\${attempt}-\${diagnosticName}.png\`);
    const domState = await page.evaluate(() => {
      return {
        bodyChildCount: document.body?.childElementCount ?? -1,
        bodyText: document.body?.innerText.slice(0, 2000) ?? '',
        readyState: document.readyState,
        scripts: [...document.scripts].map(script => script.src),
        title: document.title,
        url: location.href
      };
    }).catch(captureError => ({
      captureError: String(captureError)
    }));
    const diagnostic = {
      attempt,
      domState,
      error: message,
      events: page.__diagnosticEvents,
      test: diagnosticName,
      wallTime: Date.now()
    };
    await writeFile(diagnosticPath, JSON.stringify(diagnostic, null, 2));
    await page.screenshot({
      fullPage: true,
      path: screenshotPath
    }).catch(() => {});
    console.log(\`[e2e-diagnostic] \${JSON.stringify(diagnostic)}\`);
    return {`,
  },
] as const

let content = await readFile(workerPath, 'utf8')

for (const { occurrence, replacement } of replacements) {
  content = replaceExactlyOnce(content, occurrence, replacement, workerPath)
}

await writeFile(workerPath, content)

process.stdout.write(`Patched E2E diagnostics\n`)

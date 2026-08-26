import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

test('contributes every non-secret preference loaded by the chat view', async () => {
  const settingsUrl = new URL('../settings.json', import.meta.url)
  const settings = JSON.parse(await readFile(settingsUrl, 'utf8'))

  expect(settings.map(({ id }: { readonly id: string }) => id).toSorted((a: string, b: string) => a.localeCompare(b))).toEqual(
    [
      'chat.authEnabled',
      'chat.authUseRedirect',
      'chat.backendUrl',
      'chat.chatHistoryEnabled',
      'chat.toolEnablement',
      'chat.useOwnBackend',
      'chatView.aiSessionTitleGenerationEnabled',
      'chatView.composerDropEnabled',
      'chatView.emitStreamingFunctionCallEvents',
      'chatView.passIncludeObfuscation',
      'chatView.reasoningPickerEnabled',
      'chatView.runModePickerEnabled',
      'chatView.scrollDownButtonEnabled',
      'chatView.searchEnabled',
      'chatView.showChatListTime',
      'chatView.showModelUsageMultiplier',
      'chatView.streamingEnabled',
      'chatView.todoListToolEnabled',
      'chatView.useAuthWorker',
      'chatView.useChatCoordinatorWorker',
      'chatView.useChatMathWorker',
      'chatView.useChatNetworkWorkerForRequests',
      'chatView.useChatToolWorker',
      'chatView.voiceDictationEnabled',
    ].toSorted((a, b) => a.localeCompare(b)),
  )
})

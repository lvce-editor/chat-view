/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.model-picker-has-expected-models'

const expectedModelIds = [
  'test',
  'openapi/codex-5.3',
  'openapi/gpt-5.4-mini',
  'openapi/gpt-5-mini',
  'openapi/gpt-4o-mini',
  'openapi/gpt-4o',
  'openapi/gpt-4.1-mini',
  'codex-5.3',
  'claude-code',
  'claude-haiku',
  'openRouter/openai/gpt-4o-mini',
  'openRouter/anthropic/claude-3.5-haiku',
  'openRouter/google/gemini-2.0-flash-001',
  'openRouter/openai/gpt-oss-20b:free',
  'openRouter/openai/gpt-oss-120b:free',
  'openRouter/meta-llama/llama-3.3-70b-instruct:free',
  'openRouter/google/gemma-3-27b-it:free',
  'openRouter/qwen/qwen3-coder:free',
  'openRouter/mistralai/mistral-small-3.1-24b-instruct:free',
] as const

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Locator('.ChatSendArea button.ChatSelect[name="model-picker-toggle"]').click()

  for (const modelId of expectedModelIds) {
    await expect(Locator(`.ChatModelPicker .ChatModelPickerItem[data-id="${modelId}"]`)).toHaveCount(1)
  }
}

import type { ChatModel } from '../ChatModel/ChatModel.ts'

export const getDefaultModels = (): readonly ChatModel[] => {
  const defaultModelId = 'test'
  return [
    { id: defaultModelId, name: 'test', provider: 'test' },
    { id: 'openapi/gpt-5-mini', name: 'GPT-5 Mini', provider: 'openApi' },
    { id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' },
    { id: 'openapi/gpt-4o', name: 'GPT-4o', provider: 'openApi' },
    { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' },
    { id: 'codex-5.3', name: 'Codex 5.3', provider: 'openRouter' },
    { id: 'claude-code', name: 'Claude Code', provider: 'openRouter' },
    { id: 'claude-haiku', name: 'Claude Haiku', provider: 'openRouter' },
    { id: 'openRouter/openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openRouter' },
    { id: 'openRouter/anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'openRouter' },
    { id: 'openRouter/google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'openRouter' },
    { id: 'openRouter/openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)', provider: 'openRouter' },
    { id: 'openRouter/openai/gpt-oss-120b:free', name: 'GPT OSS 120B (Free)', provider: 'openRouter' },
    { id: 'openRouter/meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)', provider: 'openRouter' },
    { id: 'openRouter/google/gemma-3-27b-it:free', name: 'Gemma 3 27B IT (Free)', provider: 'openRouter' },
    { id: 'openRouter/qwen/qwen3-coder:free', name: 'Qwen3 Coder (Free)', provider: 'openRouter' },
    {
      id: 'openRouter/mistralai/mistral-small-3.1-24b-instruct:free',
      name: 'Mistral Small 3.1 24B Instruct (Free)',
      provider: 'openRouter',
    },
  ]
}
import type { ChatModel } from '../ViewModel/ViewModel.ts'

export interface DefaultModelProviderSettings {
  readonly builtin: boolean
  readonly openai: boolean
  readonly anthropic: boolean
  readonly test: boolean
}

export const getDefaultModels = (settings: DefaultModelProviderSettings): readonly ChatModel[] => {
  return [
    ...(settings.builtin
      ? [
          { id: 'builtin/gpt-5.4', name: 'GPT 5.4', provider: 'builtin' as const, supportsReasoningEffort: true, usageCost: 1 },
          { id: 'builtin/gpt-4.1', name: 'GPT 4.1', provider: 'builtin' as const, supportsImages: true, usageCost: 1 },
        ]
      : []),
    ...(settings.openai
      ? [
          { id: 'openapi/codex-5.3', name: 'Codex 5.3', provider: 'openApi' as const, supportsReasoningEffort: true, usageCost: 1 },
          { id: 'openapi/gpt-5.4-mini', name: 'GPT-5.4 Mini', provider: 'openApi' as const, supportsReasoningEffort: true },
          { id: 'openapi/gpt-5-mini', name: 'GPT-5 Mini', provider: 'openApi' as const, supportsReasoningEffort: true },
          { id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi' as const, supportsImages: true, usageCost: 1 },
          { id: 'openapi/gpt-4o', name: 'GPT-4o', provider: 'openApi' as const, supportsImages: true, usageCost: 3 },
          { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi' as const, supportsImages: true, usageCost: 1 },
        ]
      : []),
    ...(settings.anthropic ? [] : []),
    ...(settings.test ? [{ id: 'test', name: 'test', provider: 'test' as const, usageCost: 0 }] : []),
  ]
}

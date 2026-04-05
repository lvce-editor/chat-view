export const reasoningEfforts = ['extra-high', 'high', 'medium', 'low'] as const

export type ReasoningEffort = (typeof reasoningEfforts)[number]

export const defaultReasoningEffort: ReasoningEffort = 'medium'

export const isReasoningEffort = (value: string): value is ReasoningEffort => {
  return reasoningEfforts.includes(value as ReasoningEffort)
}

export const getReasoningEffortLabel = (reasoningEffort: ReasoningEffort): string => {
  switch (reasoningEffort) {
    case 'extra-high':
      return 'Extra High'
    case 'high':
      return 'High'
    case 'low':
      return 'Low'
    case 'medium':
      return 'Medium'
    default:
      return reasoningEffort
  }
}

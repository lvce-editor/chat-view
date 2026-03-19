import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { getToolCallMergeKey } from '../GetToolCallMergeKey/GetToolCallMergeKey.ts'

export const mergeToolCalls = (existing: readonly StreamingToolCall[] = [], incoming: readonly StreamingToolCall[]): readonly StreamingToolCall[] => {
  if (incoming.length === 0) {
    return existing
  }
  const merged = [...existing]
  const indexByKey = new Map<string, number>()
  for (let i = 0; i < merged.length; i++) {
    indexByKey.set(getToolCallMergeKey(merged[i]), i)
  }
  for (const toolCall of incoming) {
    const key = getToolCallMergeKey(toolCall)
    const existingIndex = indexByKey.get(key)
    if (existingIndex === undefined) {
      indexByKey.set(key, merged.length)
      merged.push(toolCall)
      continue
    }
    merged[existingIndex] = toolCall
  }
  return merged
}

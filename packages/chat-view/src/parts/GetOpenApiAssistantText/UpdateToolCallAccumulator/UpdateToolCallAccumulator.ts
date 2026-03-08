import type { StreamingToolCall } from '../GetOpenApiAssistantTextTypes/GetOpenApiAssistantTextTypes.ts'

export const updateToolCallAccumulator = (
  accumulator: Readonly<Record<number, StreamingToolCall>>,
  chunk: readonly unknown[],
):
  | {
      readonly nextAccumulator: Readonly<Record<number, StreamingToolCall>>
      readonly toolCalls: readonly StreamingToolCall[]
    }
  | undefined => {
  let changed = false
  const nextAccumulator: Record<number, StreamingToolCall> = { ...accumulator }
  for (const item of chunk) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const index = Reflect.get(item, 'index')
    if (typeof index !== 'number') {
      continue
    }
    const current = nextAccumulator[index] || { arguments: '', name: '' }
    const id = Reflect.get(item, 'id')
    const toolFunction = Reflect.get(item, 'function')
    let { name } = current
    let args = current.arguments
    if (toolFunction && typeof toolFunction === 'object') {
      const deltaName = Reflect.get(toolFunction, 'name')
      const deltaArguments = Reflect.get(toolFunction, 'arguments')
      if (typeof deltaName === 'string' && deltaName) {
        name = deltaName
      }
      if (typeof deltaArguments === 'string') {
        args += deltaArguments
      }
    }
    const next: StreamingToolCall = {
      arguments: args,
      ...(typeof id === 'string'
        ? {
            id,
          }
        : current.id
          ? {
              id: current.id,
            }
          : {}),
      name,
    }
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      nextAccumulator[index] = next
      changed = true
    }
  }
  if (!changed) {
    return undefined
  }
  const toolCalls = Object.entries(nextAccumulator)
    .toSorted((a: readonly [string, StreamingToolCall], b: readonly [string, StreamingToolCall]) => Number(a[0]) - Number(b[0]))
    .map((entry: readonly [string, StreamingToolCall]) => entry[1])
    .filter((toolCall) => !!toolCall.name)
  return {
    nextAccumulator,
    toolCalls,
  }
}

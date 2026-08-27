import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'
import { hasLegacyStreamingToolCalls } from '../HasLegacyStreamingToolCalls/HasLegacyStreamingToolCalls.ts'

export const isStreamingFunctionCallEvent = (parsed: unknown): boolean => {
  if (hasLegacyStreamingToolCalls(parsed)) {
    return true
  }
  if (!parsed || typeof parsed !== 'object') {
    return false
  }
  const type = getObjectProperty(parsed, 'type')
  if (type === 'response.function_call_arguments.delta' || type === 'response.function_call_arguments.done') {
    return true
  }
  if (type !== 'response.output_item.added' && type !== 'response.output_item.done') {
    return false
  }
  const item = getObjectProperty(parsed, 'item')
  if (!item || typeof item !== 'object') {
    return false
  }
  return getObjectProperty(item, 'type') === 'function_call'
}

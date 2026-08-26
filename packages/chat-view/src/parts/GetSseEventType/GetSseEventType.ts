import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

export const getSseEventType = (value: unknown): 'sse-response-completed' | 'sse-response-part' => {
  return getObjectProperty(value, 'type') === 'response.completed' ? 'sse-response-completed' : 'sse-response-part'
}

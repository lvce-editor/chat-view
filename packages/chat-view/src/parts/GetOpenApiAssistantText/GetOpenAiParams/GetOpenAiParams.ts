import { getOpenAiTools } from '../GetOpenAiTools/GetOpenAiTools.ts'

export const getOpenAiParams = (
  input: readonly unknown[],
  modelId: string,
  stream: boolean,
  includeObfuscation: boolean,
  tools: readonly unknown[],
  previousResponseId?: string,
): object => {
  return {
    include_obfuscation: includeObfuscation,
    input,
    model: modelId,
    ...(stream
      ? {
          stream: true,
        }
      : {}),
    ...(previousResponseId
      ? {
          previous_response_id: previousResponseId,
        }
      : {}),
    tool_choice: 'auto',
    tools: getOpenAiTools(tools),
  }
}

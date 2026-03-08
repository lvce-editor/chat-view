interface ResponseFunctionCall {
  readonly arguments: string
  readonly callId: string
  readonly name: string
}

export const getResponseFunctionCalls = (parsed: unknown): readonly ResponseFunctionCall[] => {
  if (!parsed || typeof parsed !== 'object') {
    return []
  }
  const output = Reflect.get(parsed, 'output')
  if (!Array.isArray(output)) {
    return []
  }
  const calls: ResponseFunctionCall[] = []
  for (const outputItem of output) {
    if (!outputItem || typeof outputItem !== 'object') {
      continue
    }
    const itemType = Reflect.get(outputItem, 'type')
    if (itemType !== 'function_call') {
      continue
    }
    const callId = Reflect.get(outputItem, 'call_id')
    const name = Reflect.get(outputItem, 'name')
    const rawArguments = Reflect.get(outputItem, 'arguments')
    if (typeof callId !== 'string' || typeof name !== 'string') {
      continue
    }
    calls.push({
      arguments: typeof rawArguments === 'string' ? rawArguments : '',
      callId,
      name,
    })
  }
  return calls
}

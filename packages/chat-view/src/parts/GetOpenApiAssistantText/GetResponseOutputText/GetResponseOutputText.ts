export const getResponseOutputText = (parsed: unknown): string => {
  if (!parsed || typeof parsed !== 'object') {
    return ''
  }

  const outputText = Reflect.get(parsed, 'output_text')
  if (typeof outputText === 'string') {
    return outputText
  }

  const output = Reflect.get(parsed, 'output')
  if (!Array.isArray(output)) {
    return ''
  }

  const chunks: string[] = []
  for (const outputItem of output) {
    if (!outputItem || typeof outputItem !== 'object') {
      continue
    }
    const itemType = Reflect.get(outputItem, 'type')
    if (itemType !== 'message') {
      continue
    }
    const content = Reflect.get(outputItem, 'content')
    if (!Array.isArray(content)) {
      continue
    }
    for (const part of content) {
      if (!part || typeof part !== 'object') {
        continue
      }
      const partType = Reflect.get(part, 'type')
      const text = Reflect.get(part, 'text')
      if ((partType === 'output_text' || partType === 'text') && typeof text === 'string') {
        chunks.push(text)
      }
    }
  }
  return chunks.join('')
}

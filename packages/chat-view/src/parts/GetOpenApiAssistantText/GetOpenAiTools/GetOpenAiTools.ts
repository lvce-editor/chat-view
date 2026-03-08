export const getOpenAiTools = (tools: readonly unknown[]): readonly unknown[] => {
  return tools.map((tool) => {
    if (!tool || typeof tool !== 'object') {
      return tool
    }
    const type = Reflect.get(tool, 'type')
    const toolFunction = Reflect.get(tool, 'function')
    if (type !== 'function' || !toolFunction || typeof toolFunction !== 'object') {
      return tool
    }
    const name = Reflect.get(toolFunction, 'name')
    const description = Reflect.get(toolFunction, 'description')
    const parameters = Reflect.get(toolFunction, 'parameters')
    return {
      ...(typeof description === 'string'
        ? {
            description,
          }
        : {}),
      ...(typeof name === 'string'
        ? {
            name,
          }
        : {}),
      ...(parameters && typeof parameters === 'object'
        ? {
            parameters,
          }
        : {}),
      type: 'function',
    }
  })
}

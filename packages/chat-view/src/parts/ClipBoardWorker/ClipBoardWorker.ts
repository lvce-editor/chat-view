let text = ''

export const writeText = async (value: string): Promise<void> => {
  text = value
}

export const readText = async (): Promise<string> => {
  return text
}

export const reset = (): void => {
  text = ''
}

export const getSseDataLines = (event: string): readonly string[] => {
  const lines = event.split(/\r?\n/)
  const dataLines: string[] = []
  for (const line of lines) {
    if (!line.startsWith('data:')) {
      continue
    }
    dataLines.push(line.slice(5).trimStart())
  }
  return dataLines
}
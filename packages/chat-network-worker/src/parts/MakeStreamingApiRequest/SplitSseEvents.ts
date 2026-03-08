export const splitSseEvents = (chunk: string): string[] => {
  return chunk.split(/\r?\n\r?\n/)
}

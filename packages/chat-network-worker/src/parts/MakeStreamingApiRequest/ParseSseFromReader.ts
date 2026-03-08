import { getSseDataLines } from './GetSseDataLines.ts'
import { parseSseData } from './ParseSseData.ts'
import { splitSseEvents } from './SplitSseEvents.ts'

export const parseSseFromReader = async (responseBody: Readonly<ReadableStream<Uint8Array>> | null): Promise<readonly unknown[]> => {
  if (!responseBody) {
    return []
  }

  const reader = responseBody.getReader()
  const decoder = new TextDecoder()
  let remainder = ''
  const events: unknown[] = []
  let done = false

  while (!done) {
    const { done: streamDone, value } = await reader.read()
    if (streamDone) {
      done = true
    } else if (value) {
      remainder += decoder.decode(value, { stream: true })
    }

    const chunks = splitSseEvents(remainder)
    remainder = chunks.pop() ?? ''
    for (const chunk of chunks) {
      const dataLines = getSseDataLines(chunk)
      for (const line of dataLines) {
        events.push(parseSseData(line))
      }
    }
  }

  if (remainder) {
    const dataLines = getSseDataLines(remainder)
    for (const line of dataLines) {
      events.push(parseSseData(line))
    }
  }

  return events
}

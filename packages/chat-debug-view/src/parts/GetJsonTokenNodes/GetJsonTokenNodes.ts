import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'

const numberRegex = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/

interface TokenSegment {
  readonly className: string
  readonly value: string
}

const getTokenSegments = (json: string): readonly TokenSegment[] => {
  const segments: TokenSegment[] = []
  const pushToken = (className: string, value: string): void => {
    if (!value) {
      return
    }
    const lastSegment = segments.at(-1)
    if (lastSegment && lastSegment.className === className) {
      const merged = {
        className,
        value: lastSegment.value + value,
      }
      segments[segments.length - 1] = merged
      return
    }
    segments.push({ className, value })
  }
  let i = 0
  while (i < json.length) {
    const character = json[i]
    if (character === '"') {
      const start = i
      i++
      while (i < json.length) {
        const currentCharacter = json[i]
        if (currentCharacter === '\\') {
          i += 2
          continue
        }
        if (currentCharacter === '"') {
          i++
          break
        }
        i++
      }
      const tokenValue = json.slice(start, i)
      let lookAheadIndex = i
      while (lookAheadIndex < json.length && /\s/u.test(json[lookAheadIndex])) {
        lookAheadIndex++
      }
      const className = json[lookAheadIndex] === ':' ? 'TokenKey' : 'TokenString'
      pushToken(className, tokenValue)
      continue
    }

    const numberMatch = numberRegex.exec(json.slice(i))
    if (numberMatch) {
      pushToken('TokenNumeric', numberMatch[0])
      i += numberMatch[0].length
      continue
    }

    if (json.startsWith('true', i)) {
      pushToken('TokenBoolean', 'true')
      i += 4
      continue
    }

    if (json.startsWith('false', i)) {
      pushToken('TokenBoolean', 'false')
      i += 5
      continue
    }

    if (json.startsWith('null', i)) {
      pushToken('TokenBoolean', 'null')
      i += 4
      continue
    }

    pushToken('TokenText', character)
    i++
  }
  return segments
}

export const getJsonTokenNodes = (value: unknown): readonly VirtualDomNode[] => {
  const json = JSON.stringify(value, null, 2)
  if (!json) {
    return [
      {
        childCount: 1,
        className: 'TokenText',
        type: VirtualDomElements.Span,
      },
      text(String(json)),
    ]
  }
  const segments = getTokenSegments(json)
  return segments.flatMap((segment) => {
    return [
      {
        childCount: 1,
        className: segment.className,
        type: VirtualDomElements.Span,
      },
      text(segment.value),
    ]
  })
}

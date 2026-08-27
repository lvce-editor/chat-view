import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

const getNumericCount = (parsed: object): number | undefined => {
  const count = getObjectProperty(parsed, 'count')
  if (typeof count === 'number' && Number.isFinite(count)) {
    return count
  }
  const matchCount = getObjectProperty(parsed, 'matchCount')
  if (typeof matchCount === 'number' && Number.isFinite(matchCount)) {
    return matchCount
  }
  return undefined
}

const getArrayCount = (parsed: object): number | undefined => {
  const matches = getObjectProperty(parsed, 'matches')
  if (Array.isArray(matches)) {
    return matches.length
  }
  const files = getObjectProperty(parsed, 'files')
  if (Array.isArray(files)) {
    return files.length
  }
  const results = getObjectProperty(parsed, 'results')
  if (Array.isArray(results)) {
    return results.length
  }
  return undefined
}

export const getGlobMatchCount = (result: string | undefined): number | undefined => {
  if (!result) {
    return undefined
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(result) as unknown
  } catch {
    return undefined
  }
  if (Array.isArray(parsed)) {
    return parsed.length
  }
  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }
  return getNumericCount(parsed) ?? getArrayCount(parsed)
}

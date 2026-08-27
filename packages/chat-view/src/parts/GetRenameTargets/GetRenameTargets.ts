import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

export interface RenameTarget {
  readonly clickableUri: string
  readonly title: string
}

export interface RenameTargets {
  readonly from: RenameTarget
  readonly to: RenameTarget
}

export const getRenameTargets = (rawArguments: string): RenameTargets | undefined => {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawArguments)
  } catch {
    return undefined
  }
  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }
  const oldUri = getObjectProperty(parsed, 'oldUri')
  const newUri = getObjectProperty(parsed, 'newUri')
  if (typeof oldUri !== 'string' || !oldUri || typeof newUri !== 'string' || !newUri) {
    return undefined
  }
  return {
    from: {
      clickableUri: oldUri,
      title: oldUri,
    },
    to: {
      clickableUri: newUri,
      title: newUri,
    },
  }
}

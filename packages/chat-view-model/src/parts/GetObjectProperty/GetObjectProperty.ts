import { isObject } from '../IsObject/IsObject.ts'

export const getObjectProperty = (value: unknown, key: string): unknown => {
  if (!isObject(value)) {
    return undefined
  }
  return value[key]
}
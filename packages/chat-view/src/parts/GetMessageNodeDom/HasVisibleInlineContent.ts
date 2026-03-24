import type { MessageTextNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const hasVisibleInlineContent = (children: MessageTextNode['children']): boolean => {
  return children.some((child) => child.type !== 'text' || child.text.trim() !== '')
}

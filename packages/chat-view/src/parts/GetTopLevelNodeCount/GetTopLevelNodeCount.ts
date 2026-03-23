import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'

export const getTopLevelNodeCount = (nodes: readonly VirtualDomNode[]): number => {
  let topLevelCount = 0
  let index = 0
  while (index < nodes.length) {
    topLevelCount++
    const currentNode = nodes[index]
    let remainingChildCount = currentNode.childCount || 0
    index += 1
    while (remainingChildCount > 0 && index < nodes.length) {
      const childNode = nodes[index]
      remainingChildCount -= 1
      remainingChildCount += childNode.childCount || 0
      index += 1
    }
  }
  return topLevelCount
}

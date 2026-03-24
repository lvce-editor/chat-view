import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageHeadingNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const getHeadingElementType = (level: MessageHeadingNode['level']): number => {
  switch (level) {
    case 1:
      return VirtualDomElements.H1
    case 2:
      return VirtualDomElements.H2
    case 3:
      return VirtualDomElements.H3
    case 4:
      return VirtualDomElements.H4
    case 5:
      return VirtualDomElements.H5
    case 6:
      return VirtualDomElements.H6
  }
}

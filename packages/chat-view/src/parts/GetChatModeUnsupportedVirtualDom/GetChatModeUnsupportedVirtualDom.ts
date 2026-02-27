import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const getChatModeUnsupportedVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    text('Unknown view mode'),
  ]
}

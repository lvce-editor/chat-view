import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'

 
export const getRunModeOptionDom = (runMode: RunMode, selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      selected: runMode === selectedRunMode,
      type: VirtualDomElements.Option,
      value: runMode,
    },
    text(runMode),
  ]
}

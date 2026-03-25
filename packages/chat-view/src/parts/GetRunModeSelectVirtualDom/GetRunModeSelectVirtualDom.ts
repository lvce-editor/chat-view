import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getRunModeOptionDom } from '../GetRunModeOptionDom/GetRunModeOptionDom.ts'
import * as InputName from '../InputName/InputName.ts'

const runModes: readonly RunMode[] = ['local', 'background', 'cloud']

export const getRunModeSelectVirtualDom = (selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  const runModeOptions = runModes.flatMap((runMode) => getRunModeOptionDom(runMode, selectedRunMode))
  return [
    {
      childCount: runModes.length,
      className: ClassNames.Select,
      name: InputName.RunMode,
      onInput: DomEventListenerFunctions.HandleRunModeChange,
      type: VirtualDomElements.Select,
      value: selectedRunMode,
    },
    ...runModeOptions,
  ]
}

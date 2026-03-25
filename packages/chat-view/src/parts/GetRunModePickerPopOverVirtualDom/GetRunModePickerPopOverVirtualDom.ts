import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const runModes: readonly RunMode[] = ['local', 'background', 'cloud']
const runModePickerHeight = runModes.length * 28

const getRunModeOptionsVirtualDom = (selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  return runModes.flatMap((runMode) =>
    getCustomSelectOptionVirtualDom(InputName.getRunModePickerItemInputName(runMode), runMode, runMode === selectedRunMode),
  )
}

export const getRunModePickerPopOverVirtualDom = (selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerContainer,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPicker,
      style: `height: ${runModePickerHeight}px;`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: runModes.length,
      className: ClassNames.ChatModelPickerList,
      type: VirtualDomElements.Ul,
    },
    ...getRunModeOptionsVirtualDom(selectedRunMode),
  ]
}

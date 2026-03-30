import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getCustomSelectPopOverVirtualDom } from '../GetCustomSelectPopOverVirtualDom/GetCustomSelectPopOverVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const runModes: readonly RunMode[] = ['local', 'background', 'cloud']
const runModePickerHeight = runModes.length * 28

const getRunModeOptionsVirtualDom = (selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  return runModes.flatMap((runMode) =>
    getCustomSelectOptionVirtualDom(InputName.getRunModePickerItemInputName(runMode), runMode, runMode === selectedRunMode),
  )
}

export const getRunModePickerPopOverVirtualDom = (selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  return getCustomSelectPopOverVirtualDom(
    runModes.length,
    runModePickerHeight,
    getRunModeOptionsVirtualDom(selectedRunMode),
    ClassNames.RunModePickerContainer,
    ClassNames.RunModePickerPopOver,
    false,
  )
}

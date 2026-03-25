import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const runModes: readonly RunMode[] = ['local', 'background', 'cloud']
const runModePickerHeight = runModes.length * 28

const getRunModeOptionsVirtualDom = (selectedRunMode: RunMode): readonly VirtualDomNode[] => {
  return runModes.flatMap((runMode) =>
    getCustomSelectOptionVirtualDom(InputName.getRunModePickerItemInputName(runMode), runMode, runMode === selectedRunMode),
  )
}

export const getRunModePickerVirtualDom = (selectedRunMode: RunMode, runModePickerOpen: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: runModePickerOpen ? 2 : 1,
      className: ClassNames.CustomSelectContainer,
      type: VirtualDomElements.Div,
    },
    ...getCustomSelectToggleVirtualDom(
      selectedRunMode,
      InputName.RunModePickerToggle,
      runModePickerOpen,
      DomEventListenerFunctions.HandleClickRunModePickerToggle,
    ),
    ...(runModePickerOpen
      ? [
          {
            childCount: 1,
            className: mergeClassNames(ClassNames.ChatModelPicker, ClassNames.CustomSelectPopOver),
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
      : []),
  ]
}

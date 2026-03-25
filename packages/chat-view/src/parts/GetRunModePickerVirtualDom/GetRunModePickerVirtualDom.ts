import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getRunModePickerVirtualDom = (selectedRunMode: RunMode, runModePickerOpen: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.CustomSelectContainer,
      type: VirtualDomElements.Div,
    },
    ...getCustomSelectToggleVirtualDom(
      selectedRunMode,
      InputName.RunModePickerToggle,
      runModePickerOpen,
      DomEventListenerFunctions.HandleClickRunModePickerToggle,
    ),
  ]
}

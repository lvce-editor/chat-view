import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectPickerToggleVirtualDom } from '../GetCustomSelectPickerToggleVirtualDom/GetCustomSelectPickerToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getRunModePickerVirtualDom = (
  selectedRunMode: RunMode,
  runModePickerOpen: boolean,
<<<<<<< HEAD
  renderSelectChevrons = true,
=======
  selectChevronEnabled = true,
>>>>>>> origin/main
): readonly VirtualDomNode[] => {
  return getCustomSelectPickerToggleVirtualDom(
    selectedRunMode,
    InputName.RunModePickerToggle,
    runModePickerOpen,
    DomEventListenerFunctions.HandleClickRunModePickerToggle,
<<<<<<< HEAD
    renderSelectChevrons,
=======
    undefined,
    undefined,
    undefined,
    selectChevronEnabled,
>>>>>>> origin/main
  )
}

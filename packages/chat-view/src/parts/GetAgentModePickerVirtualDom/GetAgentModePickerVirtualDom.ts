import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { getAgentModeLabel, type AgentMode } from '../AgentMode/AgentMode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectPickerToggleVirtualDom } from '../GetCustomSelectPickerToggleVirtualDom/GetCustomSelectPickerToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getAgentModePickerVirtualDom = (
  selectedAgentMode: AgentMode,
  agentModePickerOpen: boolean,
<<<<<<< HEAD
  renderSelectChevrons: boolean,
=======
  selectChevronEnabled = true,
>>>>>>> origin/main
): readonly VirtualDomNode[] => {
  return getCustomSelectPickerToggleVirtualDom(
    getAgentModeLabel(selectedAgentMode),
    InputName.AgentModePickerToggle,
    agentModePickerOpen,
    DomEventListenerFunctions.HandleClickAgentModePickerToggle,
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

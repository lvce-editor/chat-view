import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getAgentModeLabel, type AgentMode } from '../AgentMode/AgentMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectToggleVirtualDom } from '../GetCustomSelectToggleVirtualDom/GetCustomSelectToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getAgentModePickerVirtualDom = (selectedAgentMode: AgentMode, agentModePickerOpen: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.CustomSelectContainer,
      type: VirtualDomElements.Div,
    },
    ...getCustomSelectToggleVirtualDom(
      getAgentModeLabel(selectedAgentMode),
      InputName.AgentModePickerToggle,
      agentModePickerOpen,
      DomEventListenerFunctions.HandleClickAgentModePickerToggle,
    ),
  ]
}

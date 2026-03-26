import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { agentModes, getAgentModeLabel, type AgentMode } from '../AgentMode/AgentMode.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getCustomSelectPopOverVirtualDom } from '../GetCustomSelectPopOverVirtualDom/GetCustomSelectPopOverVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const agentModePickerHeight = agentModes.length * 28

const getAgentModeOptionsVirtualDom = (selectedAgentMode: AgentMode): readonly VirtualDomNode[] => {
  return agentModes.flatMap((agentMode) =>
    getCustomSelectOptionVirtualDom(
      InputName.getAgentModePickerItemInputName(agentMode),
      getAgentModeLabel(agentMode),
      agentMode === selectedAgentMode,
    ),
  )
}

export const getAgentModePickerPopOverVirtualDom = (selectedAgentMode: AgentMode): readonly VirtualDomNode[] => {
  return getCustomSelectPopOverVirtualDom(agentModes.length, agentModePickerHeight, getAgentModeOptionsVirtualDom(selectedAgentMode))
}

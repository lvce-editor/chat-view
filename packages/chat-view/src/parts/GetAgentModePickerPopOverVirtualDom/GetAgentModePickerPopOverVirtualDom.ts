import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { agentModes, type AgentMode } from '../AgentMode/AgentMode.ts'
import { getAgentModeOptionsVirtualDom } from '../GetAgentModeOptionsVirtualDom/GetAgentModeOptionsVirtualDom.ts'
import { getCustomSelectPopOverVirtualDom } from '../GetCustomSelectPopOverVirtualDom/GetCustomSelectPopOverVirtualDom.ts'

const agentModePickerHeight = agentModes.length * 28

export const getAgentModePickerPopOverVirtualDom = (selectedAgentMode: AgentMode): readonly VirtualDomNode[] => {
  return getCustomSelectPopOverVirtualDom(agentModes.length, agentModePickerHeight, getAgentModeOptionsVirtualDom(selectedAgentMode))
}

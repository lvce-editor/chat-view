import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { agentModes, getAgentModeLabel, type AgentMode } from '../AgentMode/AgentMode.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getAgentModeOptionsVirtualDom = (selectedAgentMode: AgentMode): readonly VirtualDomNode[] => {
  return agentModes.flatMap((agentMode) =>
    getCustomSelectOptionVirtualDom(
      InputName.getAgentModePickerItemInputName(agentMode),
      getAgentModeLabel(agentMode),
      agentMode === selectedAgentMode,
    ),
  )
}

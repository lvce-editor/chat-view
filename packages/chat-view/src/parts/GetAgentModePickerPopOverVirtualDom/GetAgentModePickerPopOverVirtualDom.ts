import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { agentModes, getAgentModeLabel, type AgentMode } from '../AgentMode/AgentMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
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
  return [
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerContainer,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatModelPicker,
      style: `height: ${agentModePickerHeight}px;`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: agentModes.length,
      className: ClassNames.ChatModelPickerList,
      type: VirtualDomElements.Ul,
    },
    ...getAgentModeOptionsVirtualDom(selectedAgentMode),
  ]
}

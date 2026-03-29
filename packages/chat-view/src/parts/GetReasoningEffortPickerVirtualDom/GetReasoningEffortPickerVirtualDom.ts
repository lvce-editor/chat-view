import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getCustomSelectPickerToggleVirtualDom } from '../GetCustomSelectPickerToggleVirtualDom/GetCustomSelectPickerToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'
import { defaultReasoningEffort, getReasoningEffortLabel, reasoningEfforts, type ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'

const reasoningEffortPickerHeight = reasoningEfforts.length * 28

const getReasoningEffortOptionsVirtualDom = (selectedReasoningEffort: ReasoningEffort): readonly VirtualDomNode[] => {
  return reasoningEfforts.flatMap((reasoningEffort) => {
    const label = getReasoningEffortLabel(reasoningEffort)
    const displayLabel = reasoningEffort === defaultReasoningEffort ? `${label} (default)` : label
    return getCustomSelectOptionVirtualDom(
      InputName.getReasoningEffortPickerItemInputName(reasoningEffort),
      displayLabel,
      reasoningEffort === selectedReasoningEffort,
    )
  })
}

export const getReasoningEffortPickerVirtualDom = (
  selectedReasoningEffort: ReasoningEffort,
  reasoningEffortPickerOpen: boolean,
): readonly VirtualDomNode[] => {
  return [
    ...getCustomSelectPickerToggleVirtualDom(
      getReasoningEffortLabel(selectedReasoningEffort),
      InputName.ReasoningEffortPickerToggle,
      reasoningEffortPickerOpen,
      DomEventListenerFunctions.HandleClickReasoningEffortPickerToggle,
      'Reasoning',
      'Reasoning',
      reasoningEffortPickerOpen ? 2 : 1,
    ),
    ...(reasoningEffortPickerOpen
      ? [
          {
            childCount: 1,
            className: mergeClassNames(ClassNames.ChatModelPicker, ClassNames.CustomSelectPopOver),
            style: `height: ${reasoningEffortPickerHeight}px;`,
            type: VirtualDomElements.Div,
          },
          {
            childCount: reasoningEfforts.length,
            className: ClassNames.ChatModelPickerList,
            name: InputName.PickerList,
            tabIndex: -1,
            type: VirtualDomElements.Ul,
          },
          ...getReasoningEffortOptionsVirtualDom(selectedReasoningEffort),
        ]
      : []),
  ]
}

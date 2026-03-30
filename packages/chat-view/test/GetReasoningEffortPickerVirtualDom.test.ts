import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getReasoningEffortPickerVirtualDom } from '../src/parts/GetReasoningEffortPickerVirtualDom/GetReasoningEffortPickerVirtualDom.ts'

test('getReasoningEffortPickerVirtualDom should render overlay click handler when open', () => {
  const result = getReasoningEffortPickerVirtualDom('medium', true)
  const overlay = result.find((node) => node.className === ClassNames.ChatModelPickerContainer)
  expect(overlay).toMatchObject({
    childCount: 1,
    className: ClassNames.ChatModelPickerContainer,
    onClick: DomEventListenerFunctions.HandleClickCustomSelectOverlay,
    type: VirtualDomElements.Div,
  })
})

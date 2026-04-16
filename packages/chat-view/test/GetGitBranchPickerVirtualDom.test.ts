import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getGitBranchPickerVirtualDom } from '../src/parts/GetGitBranchPickerVirtualDom/GetGitBranchPickerVirtualDom.ts'

test('getGitBranchPickerVirtualDom should render overlay click handler when open', () => {
  const result = getGitBranchPickerVirtualDom([{ current: true, name: 'main' }], true, '', 'main', true)
  const overlay = result.find((node) => node.className === ClassNames.ChatModelPickerContainer)
  expect(overlay).toMatchObject({
    childCount: 1,
    className: ClassNames.ChatModelPickerContainer,
    onClick: DomEventListenerFunctions.HandleClickCustomSelectOverlay,
    type: VirtualDomElements.Div,
  })
})

import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectPopOverVirtualDom } from '../src/parts/GetCustomSelectPopOverVirtualDom/GetCustomSelectPopOverVirtualDom.ts'

test('getCustomSelectPopOverVirtualDom should close on overlay click', () => {
  const result = getCustomSelectPopOverVirtualDom(0, 28, [])
  expect(result[0]).toMatchObject({
    childCount: 1,
    className: ClassNames.ChatModelPickerContainer,
    onClick: DomEventListenerFunctions.HandleClickCustomSelectOverlay,
    type: VirtualDomElements.Div,
  })
})

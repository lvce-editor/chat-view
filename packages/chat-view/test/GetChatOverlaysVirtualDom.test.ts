import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getChatOverlaysVirtualDom } from '../src/parts/GetChatOverlaysVirtualDom/GetChatOverlaysVirtualDom.ts'

const models = [{ id: 'test', name: 'Test Model', usageCost: 0 }] as const

test('getChatOverlaysVirtualDom should return empty array when no overlays are visible', () => {
  const result = getChatOverlaysVirtualDom({
    agentMode: 'agent',
    agentModePickerVisible: false,
    dropOverlayVisible: false,
    modelPickerSearchValue: '',
    modelPickerVisible: false,
    runMode: 'local',
    runModePickerVisible: false,
    selectedModelId: 'test',
    visibleModels: models,
  })

  expect(result).toEqual([])
})

test('getChatOverlaysVirtualDom should wrap all visible overlays in ChatOverlays', () => {
  const result = getChatOverlaysVirtualDom({
    agentMode: 'agent',
    agentModePickerVisible: true,
    dropOverlayVisible: true,
    modelPickerSearchValue: '',
    modelPickerVisible: true,
    runMode: 'background',
    runModePickerVisible: true,
    selectedModelId: 'test',
    visibleModels: models,
  })

  expect(result[0]).toMatchObject({
    childCount: 4,
    className: ClassNames.ChatOverlays,
    type: VirtualDomElements.Div,
  })
  expect(result.find((node) => node.name === 'composer-drop-target')).toBeDefined()
  expect(result.find((node) => node.name === 'agent-mode-picker-item:agent')).toBeDefined()
  expect(result.find((node) => node.name === 'model-picker-search')).toBeDefined()
  expect(result.find((node) => node.name === 'run-mode-picker-item:background')).toBeDefined()
})

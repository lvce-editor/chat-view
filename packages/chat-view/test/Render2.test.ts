import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { FocusModelPickerInput } from '../src/parts/OpenModelPicker/OpenModelPicker.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'
import * as ChatStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('render2 sends view-scoped focus commands to the direct renderer', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const uid = 1
  const oldState = { ...createDefaultState(), uid }
  const newState = { ...oldState, focus: 'model-picker-input' as const }
  ChatStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [DiffType.RenderFocus, DiffType.RenderFocusContext])

  expect(queueCommands).toHaveBeenCalledWith(uid, [['Viewlet.focusSelector', uid, '[name="model-picker-search"]']])
  expect(result).toEqual([
    ['Viewlet.setFocusContext', uid, FocusModelPickerInput],
    ['Viewlet.commitPending', uid, 17],
  ])
})

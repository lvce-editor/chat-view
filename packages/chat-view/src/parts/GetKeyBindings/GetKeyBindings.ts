import { WhenExpression } from '@lvce-editor/constants'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
    {
      command: 'Chat.handleSubmit',
      key: KeyCode.Enter,
      when: WhenExpression.FocusChatInput,
    },
    {
      command: 'Chat.enterNewLine',
      key: KeyModifier.Shift | KeyCode.Enter,
      when: WhenExpression.FocusChatInput,
    },
  ]
}

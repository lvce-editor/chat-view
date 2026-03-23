import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setTodoListToolEnabled = (state: ChatState, todoListToolEnabled: boolean): ChatState => {
  return {
    ...state,
    todoListToolEnabled,
  }
}

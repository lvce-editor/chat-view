import type { ChatState } from '../ChatState/ChatState.ts'

export const setTodolistToolEnabled = (state: ChatState, todoListToolEnabled: boolean): ChatState => {
  return {
    ...state,
    todoListToolEnabled,
  }
}

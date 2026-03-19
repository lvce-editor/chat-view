import * as Preferences from '../Preferences/Preferences.ts'

export const loadTodoListToolEnabled = async (): Promise<boolean> => {
  try {
    const savedTodoListToolEnabled = await Preferences.get('chatView.todoListToolEnabled')
    return typeof savedTodoListToolEnabled === 'boolean' ? savedTodoListToolEnabled : false
  } catch {
    return false
  }
}

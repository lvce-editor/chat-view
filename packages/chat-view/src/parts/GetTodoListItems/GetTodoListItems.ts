import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import { parseTodoListArguments } from '../ParseTodoListArguments/ParseTodoListArguments.ts'

export const getTodoListItems = (sessions: readonly ChatSession[], selectedSessionId: string): readonly TodoListItem[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  if (!selectedSession) {
    return []
  }
  let todoItems: readonly TodoListItem[] = []
  for (const message of selectedSession.messages) {
    if (message.role !== 'assistant' || !message.toolCalls) {
      continue
    }
    for (const toolCall of message.toolCalls) {
      if (toolCall.name !== 'todo_list') {
        continue
      }
      const parsedTodos = parseTodoListArguments(toolCall.arguments)
      todoItems = parsedTodos
    }
  }
  return todoItems
}

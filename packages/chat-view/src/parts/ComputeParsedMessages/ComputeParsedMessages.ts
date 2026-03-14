import type { ChatMessage, ChatSession } from '../ChatState/ChatState.ts'
import type { MessageInlineNode, MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ChatMathWorker from '../ChatMathWorker/ChatMathWorker.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

type MathExpression = readonly [string, boolean]

const getInlineMathExpressions = (inlineNodes: readonly MessageInlineNode[]): readonly MathExpression[] => {
  const expressions: MathExpression[] = []
  for (const inlineNode of inlineNodes) {
    if (inlineNode.type === 'math-inline') {
      expressions.push([inlineNode.text, inlineNode.displayMode])
    }
  }
  return expressions
}

const getMathExpressions = (nodes: readonly MessageIntermediateNode[]): readonly MathExpression[] => {
  const expressions: MathExpression[] = []
  for (const node of nodes) {
    if (node.type === 'text' || node.type === 'heading') {
      expressions.push(...getInlineMathExpressions(node.children))
      continue
    }
    if (node.type === 'ordered-list' || node.type === 'unordered-list') {
      for (const item of node.items) {
        expressions.push(...getInlineMathExpressions(item.children))
        if (item.nestedItems) {
          for (const nestedItem of item.nestedItems) {
            expressions.push(...getInlineMathExpressions(nestedItem.children))
          }
        }
      }
      continue
    }
    if (node.type === 'table') {
      for (const header of node.headers) {
        expressions.push(...getInlineMathExpressions(header.children))
      }
      for (const row of node.rows) {
        for (const cell of row.cells) {
          expressions.push(...getInlineMathExpressions(cell.children))
        }
      }
      continue
    }
    if (node.type === 'math-block') {
      expressions.push([node.text, true])
    }
  }
  return expressions
}

const preRenderMathExpressions = async (nodes: readonly MessageIntermediateNode[], useChatMathWorker: boolean): Promise<void> => {
  if (!useChatMathWorker) {
    return
  }
  const expressions = getMathExpressions(nodes)
  if (expressions.length === 0) {
    return
  }
  const uniqueExpressions = [...new Set(expressions.map((expression) => `${expression[1] ? '1' : '0'}:${expression[0]}`))]
  await Promise.all(
    uniqueExpressions.map(async (value) => {
      const displayMode = value.startsWith('1:')
      const text = value.slice(2)
      try {
        await ChatMathWorker.renderToString(text, displayMode)
      } catch {
        // Leave fallback rendering in place for invalid or unavailable math worker results.
      }
    }),
  )
}

export const parseMessages = async (
  messages: readonly ChatMessage[],
  useChatMathWorker: boolean,
): Promise<readonly (readonly MessageIntermediateNode[])[]> => {
  const parsedMessages = messages.map((message) => parseMessageContent(message.text))
  await Promise.all(parsedMessages.map((nodes) => preRenderMathExpressions(nodes, useChatMathWorker)))
  return parsedMessages
}

export const getParsedMessagesForSession = async (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  useChatMathWorker: boolean,
): Promise<readonly (readonly MessageIntermediateNode[])[]> => {
  const session = sessions.find((candidate) => candidate.id === selectedSessionId)
  if (!session) {
    return []
  }
  return parseMessages(session.messages, useChatMathWorker)
}

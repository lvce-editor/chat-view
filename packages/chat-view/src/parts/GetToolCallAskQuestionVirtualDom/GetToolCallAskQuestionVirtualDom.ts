import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'
import { parseAskQuestionArguments } from '../ParseAskQuestionArguments/ParseAskQuestionArguments.ts'

const chatToolCallQuestionTextNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatToolCallQuestionText,
  type: VirtualDomElements.Div,
}

const toolCallNameNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ToolCallName,
  type: VirtualDomElements.Span,
}

const chatToolCallQuestionOptionNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatToolCallQuestionOption,
  type: VirtualDomElements.Span,
}

export const getToolCallAskQuestionVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const parsed = parseAskQuestionArguments(toolCall.arguments)
  const statusLabel = getToolCallStatusLabel(toolCall)
  const questionLabel = parsed.question.trim() ? parsed.question : '(empty question)'
  const answers = parsed.answers.length > 0 ? parsed.answers : ['(no answers)']
  const childCount = 2
  return [
    {
      childCount,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    chatToolCallQuestionTextNode,
    toolCallNameNode,
    text(`ask_question`),
    text(`: ${questionLabel}${statusLabel}`),
    {
      childCount: answers.length,
      className: ClassNames.ChatToolCallQuestionOptions,
      type: VirtualDomElements.Div,
    },
    ...answers.flatMap((answer) => [chatToolCallQuestionOptionNode, text(answer.trim() ? answer : '(empty answer)')]),
  ]
}

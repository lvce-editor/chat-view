import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallStatusLabel } from '../GetToolCallStatusLabel/GetToolCallStatusLabel.ts'

interface ParsedAskQuestionArguments {
  readonly answers: readonly string[]
  readonly question: string
}

const parseAskQuestionArguments = (rawArguments: string): ParsedAskQuestionArguments => {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawArguments) as unknown
  } catch {
    return {
      answers: [],
      question: '',
    }
  }
  if (!parsed || typeof parsed !== 'object') {
    return {
      answers: [],
      question: '',
    }
  }
  const question = Reflect.get(parsed, 'question')
  const rawAnswers = Reflect.get(parsed, 'answers')
  const rawChoices = Reflect.get(parsed, 'choices')
  const rawOptions = Reflect.get(parsed, 'options')
  const arrayValue = Array.isArray(rawAnswers) ? rawAnswers : Array.isArray(rawChoices) ? rawChoices : Array.isArray(rawOptions) ? rawOptions : []
  const answers = arrayValue.filter((value) => typeof value === 'string') as readonly string[]
  return {
    answers,
    question: typeof question === 'string' ? question : '',
  }
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
    {
      childCount: 1,
      className: ClassNames.ChatToolCallQuestionText,
      type: VirtualDomElements.Div,
    },
    text(`ask_question: ${questionLabel}${statusLabel}`),
    {
      childCount: answers.length,
      className: ClassNames.ChatToolCallQuestionOptions,
      type: VirtualDomElements.Div,
    },
    ...answers.flatMap((answer) => [
      {
        childCount: 1,
        className: ClassNames.ChatToolCallQuestionOption,
        type: VirtualDomElements.Span,
      },
      text(answer.trim() ? answer : '(empty answer)'),
    ]),
  ]
}

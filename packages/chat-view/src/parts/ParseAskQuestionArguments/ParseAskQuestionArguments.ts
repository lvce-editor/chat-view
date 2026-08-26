import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

interface ParsedAskQuestionArguments {
  readonly answers: readonly string[]
  readonly question: string
}

const getAnswersArray = (rawAnswers: unknown, rawChoices: unknown, rawOptions: unknown): readonly unknown[] => {
  if (Array.isArray(rawAnswers)) {
    return rawAnswers
  }
  if (Array.isArray(rawChoices)) {
    return rawChoices
  }
  if (Array.isArray(rawOptions)) {
    return rawOptions
  }
  return []
}

export const parseAskQuestionArguments = (rawArguments: string): ParsedAskQuestionArguments => {
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
  const question = getObjectProperty(parsed, 'question')
  const rawAnswers = getObjectProperty(parsed, 'answers')
  const rawChoices = getObjectProperty(parsed, 'choices')
  const rawOptions = getObjectProperty(parsed, 'options')
  const arrayValue = getAnswersArray(rawAnswers, rawChoices, rawOptions)
  const answers = arrayValue.filter((value) => typeof value === 'string') as readonly string[]
  return {
    answers,
    question: typeof question === 'string' ? question : '',
  }
}

import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

export const executeAskQuestionTool = (args: unknown): string => {
  const normalized = args && typeof args === 'object' ? args : {}
  const question = getObjectProperty(normalized, 'question')
  const answers = getObjectProperty(normalized, 'answers')
  return JSON.stringify({
    answers: Array.isArray(answers) ? answers.filter((answer) => typeof answer === 'string') : [],
    ok: true,
    question: typeof question === 'string' ? question : '',
  })
}

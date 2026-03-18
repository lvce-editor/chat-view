export const executeAskQuestionTool = (args: unknown): string => {
  const normalized = args && typeof args === 'object' ? args : {}
  const question = Reflect.get(normalized, 'question')
  const answers = Reflect.get(normalized, 'answers')
  return JSON.stringify({
    answers: Array.isArray(answers) ? answers.filter((answer) => typeof answer === 'string') : [],
    ok: true,
    question: typeof question === 'string' ? question : '',
  })
}

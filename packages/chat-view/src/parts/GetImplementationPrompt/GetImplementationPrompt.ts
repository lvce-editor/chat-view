export const getImplementationPrompt = (planText: string): string => {
  return `Execute this implementation plan in the current workspace. Inspect files as needed, make the required changes, and then summarize the result.

Plan:
${planText}`
}

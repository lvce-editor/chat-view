export const getNextChatInputHistory = (chatInputHistory: readonly string[], userText: string): readonly string[] => {
  return chatInputHistory.at(-1) === userText ? chatInputHistory : [...chatInputHistory, userText]
}
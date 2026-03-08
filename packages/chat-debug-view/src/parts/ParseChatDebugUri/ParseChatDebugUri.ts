const chatDebugUriPattern = /^chat-debug:\/\/([^/?#]+)$/

export const parseChatDebugUri = (uri: string): string => {
  if (!uri) {
    throw new Error('Missing URI')
  }
  const match = uri.match(chatDebugUriPattern)
  if (!match) {
    throw new Error('Invalid URI format')
  }
  const encodedSessionId = match[1]
  let sessionId: string
  try {
    sessionId = decodeURIComponent(encodedSessionId)
  } catch {
    throw new Error('Invalid URI encoding')
  }
  if (!sessionId || /[/?#]/.test(sessionId)) {
    throw new Error('Invalid session id')
  }
  return sessionId
}

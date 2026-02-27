import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'

const CREATE_SESSION = 'create-session'
const SESSION_PREFIX = 'session:'
const RENAME_PREFIX = 'session-rename:'
const DELETE_PREFIX = 'session-delete:'
const SEND = 'send'

export const handleClickSend = async (state: ChatState): Promise<ChatState> => {
  return HandleKeyDown.handleKeyDown(state, 'Enter', false)
}

const getNextSelectedSessionId = (sessions: readonly ChatSession[], deletedId: string): string => {
  if (sessions.length === 0) {
    return ''
  }
  const index = sessions.findIndex((session) => session.id === deletedId)
  if (index === -1) {
    return sessions[0].id
  }
  const nextIndex = Math.min(index, sessions.length - 1)
  return sessions[nextIndex].id
}

const createSession = (state: ChatState): ChatState => {
  const id = `session-${state.nextSessionId}`
  const session: ChatSession = {
    id,
    messages: [],
    title: `Chat ${state.nextSessionId}`,
  }
  return {
    ...state,
    nextSessionId: state.nextSessionId + 1,
    renamingSessionId: '',
    selectedSessionId: id,
    sessions: [...state.sessions, session],
  }
}

const selectSession = (state: ChatState, id: string): ChatState => {
  const exists = state.sessions.some((session) => session.id === id)
  if (!exists) {
    return state
  }
  return {
    ...state,
    renamingSessionId: '',
    selectedSessionId: id,
  }
}

const startRename = (state: ChatState, id: string): ChatState => {
  const session = state.sessions.find((item) => item.id === id)
  if (!session) {
    return state
  }
  return {
    ...state,
    composerValue: session.title,
    renamingSessionId: id,
    selectedSessionId: id,
  }
}

const deleteSession = (state: ChatState, id: string): ChatState => {
  const filtered = state.sessions.filter((session) => session.id !== id)
  if (filtered.length === state.sessions.length) {
    return state
  }
  if (filtered.length === 0) {
    const fallbackId = `session-${state.nextSessionId}`
    const fallback: ChatSession = {
      id: fallbackId,
      messages: [],
      title: `Chat ${state.nextSessionId}`,
    }
    return {
      ...state,
      nextSessionId: state.nextSessionId + 1,
      renamingSessionId: '',
      selectedSessionId: fallbackId,
      sessions: [fallback],
    }
  }
  return {
    ...state,
    renamingSessionId: state.renamingSessionId === id ? '' : state.renamingSessionId,
    selectedSessionId: getNextSelectedSessionId(filtered, id),
    sessions: filtered,
  }
}

export const handleClick = async (state: ChatState, name: string): Promise<ChatState> => {
  if (!name) {
    return state
  }
  if (name === CREATE_SESSION) {
    return createSession(state)
  }
  if (name.startsWith(SESSION_PREFIX)) {
    const id = name.slice(SESSION_PREFIX.length)
    return selectSession(state, id)
  }
  if (name.startsWith(RENAME_PREFIX)) {
    const id = name.slice(RENAME_PREFIX.length)
    return startRename(state, id)
  }
  if (name.startsWith(DELETE_PREFIX)) {
    const id = name.slice(DELETE_PREFIX.length)
    return deleteSession(state, id)
  }
  if (name === SEND) {
    return handleClickSend(state)
  }
  return state
}

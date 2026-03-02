export const Notifications = 'Notifications'
export const Problems = 'Problems'

export const Composer = 'composer'
export const Send = 'send'
export const Back = 'back'
export const Model = 'model'
export const CreateSession = 'create-session'
export const Settings = 'settings'
export const CloseChat = 'close-chat'
export const SessionDelete = 'SessionDelete'
export const SessionPrefix = 'session:'
export const RenamePrefix = 'session-rename:'

export type InputName =
  | typeof Notifications
  | typeof Problems
  | typeof Composer
  | typeof Send
  | typeof Back
  | typeof Model
  | typeof CreateSession
  | typeof Settings
  | typeof CloseChat
  | typeof SessionDelete
  | `${typeof SessionPrefix}${string}`
  | `${typeof RenamePrefix}${string}`

export const getSessionInputName = (sessionId: string): `${typeof SessionPrefix}${string}` => {
  return `${SessionPrefix}${sessionId}`
}

export const isSessionInputName = (name: string): name is `${typeof SessionPrefix}${string}` => {
  return name.startsWith(SessionPrefix)
}

export const getSessionIdFromInputName = (name: `${typeof SessionPrefix}${string}`): string => {
  return name.slice(SessionPrefix.length)
}

export const getRenameInputName = (sessionId: string): `${typeof RenamePrefix}${string}` => {
  return `${RenamePrefix}${sessionId}`
}

export const isRenameInputName = (name: string): name is `${typeof RenamePrefix}${string}` => {
  return name.startsWith(RenamePrefix)
}

export const getRenameIdFromInputName = (name: `${typeof RenamePrefix}${string}`): string => {
  return name.slice(RenamePrefix.length)
}

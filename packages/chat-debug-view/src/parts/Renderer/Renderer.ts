import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'

export type Renderer = (oldState: ChatDebugViewState, newState: ChatDebugViewState) => readonly unknown[]

import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const { get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<ChatState>()

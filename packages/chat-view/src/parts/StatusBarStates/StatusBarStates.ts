import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const { get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<ChatState>()

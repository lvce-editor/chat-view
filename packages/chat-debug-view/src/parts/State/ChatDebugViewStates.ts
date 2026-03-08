import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ChatDebugViewState } from './ChatDebugViewState.ts'

export const { get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<ChatDebugViewState>()

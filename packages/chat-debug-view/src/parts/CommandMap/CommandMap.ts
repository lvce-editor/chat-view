import { terminate } from '@lvce-editor/viewlet-registry'
import * as Create from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import * as Rerender from '../Rerender/Rerender.ts'
import * as Resize from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import * as SetEvents from '../SetEvents/SetEvents.ts'
import * as SetSessionId from '../SetSessionId/SetSessionId.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../State/ChatDebugViewStates.ts'

export const commandMap = {
  'ChatDebug.create': Create.create,
  'ChatDebug.diff2': diff2,
  'ChatDebug.getCommandIds': getCommandIds,
  'ChatDebug.handleInput': wrapCommand(HandleInput.handleInput),
  'ChatDebug.loadContent': wrapCommand(LoadContent.loadContent),
  'ChatDebug.loadContent2': wrapCommand(LoadContent.loadContent),
  'ChatDebug.refresh': wrapCommand(Refresh.refresh),
  'ChatDebug.render2': render2,
  'ChatDebug.renderEventListeners': renderEventListeners,
  'ChatDebug.rerender': wrapCommand(Rerender.rerender),
  'ChatDebug.resize': wrapCommand(Resize.resize),
  'ChatDebug.saveState': wrapGetter(saveState),
  'ChatDebug.setEvents': wrapCommand(SetEvents.setEvents),
  'ChatDebug.setSessionId': wrapCommand(SetSessionId.setSessionId),
  'ChatDebug.terminate': terminate,
}

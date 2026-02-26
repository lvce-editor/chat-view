import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { getKeyBindings } from '../GetKeyBindings/GetKeyBindings.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../StatusBarStates/StatusBarStates.ts'

export const commandMap = {
  'Chat.create': StatusBar.create,
  'Chat.diff2': diff2,
  'Chat.getCommandIds': getCommandIds,
  'Chat.getKeyBindings': getKeyBindings,
  'Chat.handleClick': wrapCommand(HandleClick.handleClick),
  'Chat.handleInput': wrapCommand(HandleInput.handleInput),
  'Chat.handleKeyDown': wrapCommand(HandleKeyDown.handleKeyDown),
  'Chat.initialize': initialize,
  'Chat.loadContent': wrapCommand(LoadContent.loadContent),
  'Chat.loadContent2': wrapCommand(LoadContent.loadContent),
  'Chat.render2': render2,
  'Chat.renderEventListeners': renderEventListeners,
  'Chat.resize': wrapCommand(resize),
  'Chat.saveState': wrapGetter(saveState),
  'Chat.terminate': terminate,
}

import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as ItemLeftUpdate from '../ItemLeftUpdate/ItemLeftUpdate.ts'
import * as ItemRightCreate from '../ItemRightCreate/ItemRightCreate.ts'
import * as ItemRightUpdate from '../ItemRightUpdate/ItemRightUpdate.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../StatusBarStates/StatusBarStates.ts'

export const commandMap = {
  'ChatView.create': StatusBar.create,
  'ChatView.diff2': diff2,
  'ChatView.getCommandIds': getCommandIds,
  'ChatView.handleClick': wrapCommand(HandleClick.handleClick),
  'ChatView.handleInput': wrapCommand(HandleInput.handleInput),
  'ChatView.handleKeyDown': wrapCommand(HandleKeyDown.handleKeyDown),
  'ChatView.initialize': initialize,
  'ChatView.itemLeftUpdate': wrapCommand(ItemLeftUpdate.itemLeftUpdate),
  'ChatView.itemRightCreate': wrapCommand(ItemRightCreate.itemRightCreate),
  'ChatView.itemRightUpdate': wrapCommand(ItemRightUpdate.itemRightUpdate),
  'ChatView.loadContent': wrapCommand(LoadContent.loadContent),
  'ChatView.render2': render2,
  'ChatView.renderEventListeners': renderEventListeners,
  'ChatView.resize': wrapCommand(resize),
  'ChatView.saveState': wrapGetter(saveState),
  'ChatView.terminate': terminate,
}

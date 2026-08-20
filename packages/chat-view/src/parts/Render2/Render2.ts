import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as SourceControlStates from '../StatusBarStates/StatusBarStates.ts'

const addViewUid = (uid: number, command: readonly any[]): readonly any[] => {
  if (command[0] === 'Viewlet.focusSelector') {
    return [command[0], uid, ...command.slice(1)]
  }
  return command
}

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] | Promise<readonly any[]> => {
  const { newState, oldState } = SourceControlStates.get(uid)
  SourceControlStates.set(uid, newState, newState)
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  if (!RendererProcess.isConnected()) return commands
  return renderDirect(uid, commands)
}

const renderDirect = async (uid: number, commands: readonly any[]): Promise<readonly any[]> => {
  const rendererWorkerCommands = commands.filter((command) => command[0] === 'Viewlet.setFocusContext')
  const rendererProcessCommands = commands.filter((command) => command[0] !== 'Viewlet.setFocusContext').map((command) => addViewUid(uid, command))
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, rendererProcessCommands)
  return [...rendererWorkerCommands, ['Viewlet.commitPending', uid, transactionId]]
}

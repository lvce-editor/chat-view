import { QuickPickWorker } from '@lvce-editor/rpc-registry'

interface QuickInputResult {
  readonly canceled: boolean
  readonly inputValue: string
}

export const showSessionRenameQuickInput = (initialValue: string): Promise<QuickInputResult> => {
  return QuickPickWorker.showQuickInput({ initialValue, waitUntil: 'finished' })
}
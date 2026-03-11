import * as Preferences from '../../Preferences/Preferences.ts'

export const loadComposerDragActive = async (): Promise<boolean> => {
  try {
    const savedComposerDragActive = await Preferences.get('chatView.composerDragActive')
    return typeof savedComposerDragActive === 'boolean' ? savedComposerDragActive : true
  } catch {
    return true
  }
}

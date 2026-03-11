import * as Preferences from '../../Preferences/Preferences.ts'

export const loadComposerDropActive = async (): Promise<boolean> => {
  try {
    const savedComposerDropActive = await Preferences.get('chatView.composerDropActive')
    return typeof savedComposerDropActive === 'boolean' ? savedComposerDropActive : true
  } catch {
    return true
  }
}

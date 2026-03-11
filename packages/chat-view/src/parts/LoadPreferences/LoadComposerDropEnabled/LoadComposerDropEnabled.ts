import * as Preferences from '../../Preferences/Preferences.ts'

export const loadComposerDropEnabled = async (): Promise<boolean> => {
  try {
    const savedComposerDropEnabled = await Preferences.get('chatView.composerDropEnabled')
    return typeof savedComposerDropEnabled === 'boolean' ? savedComposerDropEnabled : true
  } catch {
    return true
  }
}

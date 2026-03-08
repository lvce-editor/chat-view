import * as Preferences from '../../Preferences/Preferences.ts'

export const loadPassIncludeObfuscation = async (): Promise<boolean> => {
  try {
    const savedPassIncludeObfuscation = await Preferences.get('chatView.passIncludeObfuscation')
    return typeof savedPassIncludeObfuscation === 'boolean' ? savedPassIncludeObfuscation : false
  } catch {
    return false
  }
}
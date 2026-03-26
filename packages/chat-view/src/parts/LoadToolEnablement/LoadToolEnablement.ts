import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import { parseToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export const loadToolEnablement = async (): Promise<ToolEnablement> => {
  try {
    const savedToolEnablement = await Preferences.get('chat.toolEnablement')
    return parseToolEnablement(savedToolEnablement)
  } catch {
    return {}
  }
}

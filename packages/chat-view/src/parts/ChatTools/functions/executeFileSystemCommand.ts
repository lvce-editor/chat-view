import type { ExecuteToolOptions } from '../types'
import * as ExtensionHostShared from '../../ExtensionHost/ExtensionHostShared.ts'
import { OnFileSystem } from '../../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import { FileSystemWriteFile } from '../../ExtensionHostCommandType/ExtensionHostCommandType.ts'

export const executeFileSystemCommand = async (method: string, params: readonly unknown[], options: ExecuteToolOptions): Promise<unknown> => {
  return ExtensionHostShared.executeProvider({
    assetDir: options.assetDir,
    event: OnFileSystem,
    method,
    noProviderFoundMessage: 'No file system provider found',
    params,
    platform: options.platform,
  })
}

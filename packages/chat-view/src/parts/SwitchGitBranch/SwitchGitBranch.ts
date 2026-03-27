import * as ExtensionHostShared from '../ExtensionHost/ExtensionHostShared.ts'
import { CommandExecute } from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'

export const SwitchGitBranch = 'Chat.switchGitBranch'

export interface SwitchGitBranchOptions {
  readonly assetDir: string
  readonly branchName: string
  readonly platform: number
  readonly workspaceUri: string
}

export const switchGitBranch = async ({ assetDir, branchName, platform, workspaceUri }: SwitchGitBranchOptions): Promise<void> => {
  await ExtensionHostShared.executeProvider({
    assetDir,
    event: `onCommand:${SwitchGitBranch}`,
    method: CommandExecute,
    noProviderFoundMessage: 'No git branch switch command found',
    params: [
      SwitchGitBranch,
      {
        branchName,
        workspaceUri,
      },
    ],
    platform,
  })
}

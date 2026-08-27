import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.ts'

export const SwitchGitBranch = 'Chat.switchGitBranch'

export interface SwitchGitBranchOptions {
  readonly assetDir: string
  readonly branchName: string
  readonly platform: number
  readonly workspaceUri: string
}

export const switchGitBranch = async ({ branchName, workspaceUri }: SwitchGitBranchOptions): Promise<void> => {
  await ExtensionManagement.executeCommand(SwitchGitBranch, {
    branchName,
    workspaceUri,
  })
}

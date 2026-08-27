/* cspell:words worktree */

import { CreateBackgroundWorktree } from '../BackgroundChatCommandIds/BackgroundChatCommandIds.ts'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.ts'

export interface CreateBackgroundChatWorktreeOptions {
  readonly assetDir: string
  readonly platform: number
  readonly projectUri: string
  readonly sessionId: string
  readonly title: string
}

export interface BackgroundChatWorktree {
  readonly branchName: string
  readonly workspaceUri: string
}

export const createBackgroundChatWorktree = async ({
  projectUri,
  sessionId,
  title,
}: CreateBackgroundChatWorktreeOptions): Promise<BackgroundChatWorktree> => {
  return ExtensionManagement.executeCommand(CreateBackgroundWorktree, {
    projectUri,
    sessionId,
    title,
  }) as Promise<BackgroundChatWorktree>
}

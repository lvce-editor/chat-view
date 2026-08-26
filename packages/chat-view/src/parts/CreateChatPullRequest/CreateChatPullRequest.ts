import { CreatePullRequest } from '../BackgroundChatCommandIds/BackgroundChatCommandIds.ts'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.ts'

export interface CreateChatPullRequestOptions {
  readonly assetDir: string
  readonly branchName: string
  readonly platform: number
  readonly title: string
  readonly workspaceUri: string
}

export interface ChatPullRequestResult {
  readonly pullRequestUrl: string
}

export const createChatPullRequest = async ({ branchName, title, workspaceUri }: CreateChatPullRequestOptions): Promise<ChatPullRequestResult> => {
  return ExtensionManagement.executeCommand(CreatePullRequest, {
    branchName,
    title,
    workspaceUri,
  }) as Promise<ChatPullRequestResult>
}

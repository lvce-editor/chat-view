import { CreatePullRequest } from '../BackgroundChatCommandIds/BackgroundChatCommandIds.ts'
import * as ExtensionHostShared from '../ExtensionHost/ExtensionHostShared.ts'
import { CommandExecute } from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'

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

export const createChatPullRequest = async ({
  assetDir,
  branchName,
  platform,
  title,
  workspaceUri,
}: CreateChatPullRequestOptions): Promise<ChatPullRequestResult> => {
  return ExtensionHostShared.executeProvider({
    assetDir,
    event: `onCommand:${CreatePullRequest}`,
    method: CommandExecute,
    noProviderFoundMessage: 'No create pull request command found',
    params: [
      CreatePullRequest,
      {
        branchName,
        title,
        workspaceUri,
      },
    ],
    platform,
  }) as Promise<ChatPullRequestResult>
}

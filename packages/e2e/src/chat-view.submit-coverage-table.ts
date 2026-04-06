/* cspell:ignore Worktree */

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.submit-coverage-table'

export const skip = 1

const coverageTable = `----------------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
File                                                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
All files                                                 |   81.22 |    62.02 |   86.41 |   81.05 |
 AgentMode                                                |   88.88 |    66.66 |     100 |   88.88 |
  AgentMode.ts                                            |   88.88 |    66.66 |     100 |   88.88 | 18
 AppendMessageToSelectedSession                           |     100 |      100 |     100 |     100 |
  AppendMessageToSelectedSession.ts                       |     100 |      100 |     100 |     100 |
 ApplyRender                                              |     100 |       50 |     100 |     100 |
  ApplyRender.ts                                          |     100 |       50 |     100 |     100 | 9
 BackendAuth/GetBackendAuthUrl                            |     100 |      100 |     100 |     100 |
  GetBackendAuthUrl.ts                                    |     100 |      100 |     100 |     100 |
 BackendAuth/GetBackendLoginUrl                           |   91.66 |    71.42 |     100 |   91.66 |
  GetBackendLoginUrl.ts                                   |   91.66 |    71.42 |     100 |   91.66 | 11
 BackendAuth/GetBackendLogoutUrl                          |     100 |      100 |     100 |     100 |
  GetBackendLogoutUrl.ts                                  |     100 |      100 |     100 |     100 |
 BackendAuth/GetBackendRefreshUrl                         |     100 |      100 |     100 |     100 |
  GetBackendRefreshUrl.ts                                 |     100 |      100 |     100 |     100 |
 BackendAuth/GetLoggedOutBackendAuthState                 |     100 |      100 |     100 |     100 |
  GetLoggedOutBackendAuthState.ts                         |     100 |      100 |     100 |     100 |
 BackendAuth/GetNumber                                    |     100 |      100 |     100 |     100 |
  GetNumber.ts                                            |     100 |      100 |     100 |     100 |
 BackendAuth/GetString                                    |     100 |      100 |     100 |     100 |
  GetString.ts                                            |     100 |      100 |     100 |     100 |
 BackendAuth/IsBackendAuthResponse                        |     100 |      100 |     100 |     100 |
  IsBackendAuthResponse.ts                                |     100 |      100 |     100 |     100 |
 BackendAuth/IsObject                                     |     100 |      100 |     100 |     100 |
  IsObject.ts                                             |     100 |      100 |     100 |     100 |
 BackendAuth/LogoutFromBackend                            |      80 |       50 |     100 |      80 |
  LogoutFromBackend.ts                                    |      80 |       50 |     100 |      80 | 5
 BackendAuth/ParseBackendAuthResponse                     |      75 |       50 |     100 |      75 |
  ParseBackendAuthResponse.ts                             |      75 |       50 |     100 |      75 | 8
 BackendAuth/SyncBackendAuth                              |      68 |       50 |     100 |      68 |
  SyncBackendAuth.ts                                      |      68 |       50 |     100 |      68 | 9,30,33-34,38,41,45-46
 BackendAuth/ToBackendAuthState                           |     100 |       50 |     100 |     100 |
  ToBackendAuthState.ts                                   |     100 |       50 |     100 |     100 | 11
 BackendAuth/TrimTrailingSlashes                          |     100 |      100 |     100 |     100 |
  TrimTrailingSlashes.ts                                  |     100 |      100 |     100 |     100 |
 BackendAuth/WaitForBackendLogin                          |   81.81 |    83.33 |     100 |   81.81 |
  WaitForBackendLogin.ts                                  |   81.81 |    83.33 |     100 |   81.81 | 15,19
 BackgroundChatCommandIds                                 |     100 |      100 |     100 |     100 |
  BackgroundChatCommandIds.ts                             |     100 |      100 |     100 |     100 |
 CanCreatePullRequest                                     |     100 |      100 |     100 |     100 |
  CanCreatePullRequest.ts                                 |     100 |      100 |     100 |     100 |
 ChatCoordinatorRequest                                   |      50 |      100 |       0 |      50 |
  ChatCoordinatorRequest.ts                               |      50 |      100 |       0 |      50 | 38
 ChatInputHistoryDown                                     |      50 |      100 |       0 |      50 |
  ChatInputHistoryDown.ts                                 |      50 |      100 |       0 |      50 | 5
 ChatInputHistoryUp                                       |      50 |      100 |       0 |      50 |
  ChatInputHistoryUp.ts                                   |      50 |      100 |       0 |      50 | 5
 ChatListFocusFirst                                       |     100 |      100 |     100 |     100 |
  ChatListFocusFirst.ts                                   |     100 |      100 |     100 |     100 |
 ChatListFocusLast                                        |     100 |      100 |     100 |     100 |
  ChatListFocusLast.ts                                    |     100 |      100 |     100 |     100 |
 ChatListFocusNext                                        |     100 |       75 |     100 |     100 |
  ChatListFocusNext.ts                                    |     100 |       75 |     100 |     100 | 16
 ChatListFocusPrevious                                    |     100 |       75 |     100 |     100 |
  ChatListFocusPrevious.ts                                |     100 |       75 |     100 |     100 | 16
 ChatMessageParsingRequest                                |      75 |      100 |      50 |      75 |
  ChatMessageParsingRequest.ts                            |      75 |      100 |      50 |      75 | 5
 ChatNetworkRequest                                       |      50 |      100 |       0 |      50 |
  ChatNetworkRequest.ts                                   |      50 |      100 |       0 |      50 | 40,44
 ChatSessionStorage                                       |   96.29 |    81.25 |   88.88 |   96.29 |
  ChatSessionStorage.ts                                   |   96.29 |    81.25 |   88.88 |   96.29 | 40
 ChatStrings                                              |   98.96 |      100 |    97.8 |   98.96 |
  ChatStrings.ts                                          |   98.96 |      100 |    97.8 |   98.96 | 81,129
 ChatToolRequest                                          |     100 |      100 |     100 |     100 |
  ChatToolRequest.ts                                      |     100 |      100 |     100 |     100 |
 ClampToPercentage                                        |      80 |       50 |     100 |      80 |
  ClampToPercentage.ts                                    |      80 |       50 |     100 |      80 | 3
 ClassNames                                               |     100 |      100 |     100 |     100 |
  ClassNames.ts                                           |     100 |      100 |     100 |     100 |
 ClearInput                                               |     100 |      100 |     100 |     100 |
  ClearInput.ts                                           |     100 |      100 |     100 |     100 |
 CloseGitBranchPicker                                     |      75 |       50 |     100 |      75 |
  CloseGitBranchPicker.ts                                 |      75 |       50 |     100 |      75 | 5
 CommandMap                                               |     100 |      100 |     100 |     100 |
  CommandMap.ts                                           |     100 |      100 |     100 |     100 |
 CopyAsE2eTests                                           |     100 |    83.33 |     100 |     100 |
  CopyAsE2eTests.ts                                       |     100 |    83.33 |     100 |     100 | 28
 CopyAsE2eTests/Escape                                    |     100 |      100 |     100 |     100 |
  Escape.ts                                               |     100 |      100 |     100 |     100 |
 CopyAsE2eTests/ToFinalMessages                           |   69.56 |    58.33 |     100 |   66.66 |
  ToFinalMessages.ts                                      |   69.56 |    58.33 |     100 |   66.66 | 9-15,25
 CopyInput                                                |     100 |      100 |     100 |     100 |
  CopyInput.ts                                            |     100 |      100 |     100 |     100 |
 Create                                                   |     100 |      100 |     100 |     100 |
  Create.ts                                               |     100 |      100 |     100 |     100 |
 CreateBackgroundChatWorktree                             |     100 |      100 |     100 |     100 |
  CreateBackgroundChatWorktree.ts                         |     100 |      100 |     100 |     100 |
 CreateChatPullRequest                                    |     100 |      100 |     100 |     100 |
  CreateChatPullRequest.ts                                |     100 |      100 |     100 |     100 |
 CreateDefaultState                                       |     100 |      100 |     100 |     100 |
  CreateDefaultState.ts                                   |     100 |      100 |     100 |     100 |
 CreateExtensionHostRpc                                   |     100 |      100 |     100 |     100 |
  CreateExtensionHostRpc.ts                               |     100 |      100 |     100 |     100 |
 CreateSession                                            |     100 |    66.66 |     100 |     100 |
  CreateSession.ts                                        |     100 |    66.66 |     100 |     100 | 9-10
 CutInput                                                 |     100 |      100 |     100 |     100 |
  CutInput.ts                                             |     100 |      100 |     100 |     100 |
 DefaultMaxToolCalls                                      |     100 |      100 |     100 |     100 |
  DefaultMaxToolCalls.ts                                  |     100 |      100 |     100 |     100 |
 Delay                                                    |     100 |      100 |     100 |     100 |
  Delay.ts                                                |     100 |      100 |     100 |     100 |
 DeleteProject                                            |    85.1 |    69.23 |    92.3 |   85.36 |
  DeleteProject.ts                                        |    85.1 |    69.23 |    92.3 |   85.36 | 16-19,31,42,71
 DeleteSession                                            |   84.21 |       60 |     100 |   83.33 |
  DeleteSession.ts                                        |   84.21 |       60 |     100 |   83.33 | 11,30,35
 DeleteSessionAtIndex                                     |     100 |      100 |     100 |     100 |
  DeleteSessionAtIndex.ts                                 |     100 |      100 |     100 |     100 |
 Diff                                                     |     100 |      100 |     100 |     100 |
  Diff.ts                                                 |     100 |      100 |     100 |     100 |
 Diff2                                                    |     100 |      100 |     100 |     100 |
  Diff2.ts                                                |     100 |      100 |     100 |     100 |
 DiffCss                                                  |     100 |      100 |     100 |     100 |
  DiffCss.ts                                              |     100 |      100 |     100 |     100 |
 DiffFocus                                                |     100 |      100 |     100 |     100 |
  DiffFocus.ts                                            |     100 |      100 |     100 |     100 |
 DiffItems                                                |     100 |      100 |     100 |     100 |
  DiffItems.ts                                            |     100 |      100 |     100 |     100 |
 DiffItems/IsEqualHelpers                                 |      78 |    68.29 |     100 |   75.55 |
  IsEqualHelpers.ts                                       |      78 |    68.29 |     100 |   75.55 | 8,19,30,33-34,45,49,60,64,75,79
 DiffModules                                              |     100 |      100 |     100 |     100 |
  DiffModules.ts                                          |     100 |      100 |     100 |     100 |
 DiffScrollTop                                            |     100 |      100 |     100 |     100 |
  DiffScrollTop.ts                                        |     100 |      100 |     100 |     100 |
 DiffSelection                                            |     100 |      100 |     100 |     100 |
  DiffSelection.ts                                        |     100 |      100 |     100 |     100 |
 DiffType                                                 |     100 |      100 |     100 |     100 |
  DiffType.ts                                             |     100 |      100 |     100 |     100 |
 DiffValue                                                |     100 |      100 |     100 |     100 |
  DiffValue.ts                                            |     100 |      100 |     100 |     100 |
 DomEventListenerFunctions                                |     100 |      100 |     100 |     100 |
  DomEventListenerFunctions.ts                            |     100 |      100 |     100 |     100 |
 EnsureBlankProject                                       |      80 |       50 |     100 |      75 |
  EnsureBlankProject.ts                                   |      80 |       50 |     100 |      75 | 7
 EstimateComposerHeight                                   |     100 |      100 |     100 |     100 |
  EstimateComposerHeight.ts                               |     100 |      100 |     100 |     100 |
 ExecuteChatTool                                          |   86.13 |    77.77 |     100 |      86 |
  ExecuteChatTool.ts                                      |   86.13 |    77.77 |     100 |      86 | 23,28,38,42,53,57,61,65,69,85,96,103,136,150
 ExecuteSlashCommand                                      |      80 |       50 |     100 |      80 |
  ExecuteSlashCommand.ts                                  |      80 |       50 |     100 |      80 | 8
 ExtensionHost                                            |     100 |      100 |     100 |     100 |
  ExtensionHostShared.ts                                  |     100 |      100 |     100 |     100 |
 ExtensionHostCommandType                                 |     100 |      100 |     100 |     100 |
  ExtensionHostCommandType.ts                             |     100 |      100 |     100 |     100 |
 ExtensionHostManagement                                  |     100 |      100 |     100 |     100 |
  ExtensionHostManagement.ts                              |     100 |      100 |     100 |     100 |
 FocusInput                                               |     100 |      100 |     100 |     100 |
  FocusInput.ts                                           |     100 |      100 |     100 |     100 |
 GenerateSessionId                                        |     100 |      100 |     100 |     100 |
  GenerateSessionId.ts                                    |     100 |      100 |     100 |     100 |
 GetAddContextButtonDom                                   |      50 |      100 |       0 |      50 |
  GetAddContextButtonDom.ts                               |      50 |      100 |       0 |      50 | 7
 GetAgentModeOptionsVirtualDom                            |     100 |      100 |     100 |     100 |
  GetAgentModeOptionsVirtualDom.ts                        |     100 |      100 |     100 |     100 |
 GetAgentModePickerPopOverVirtualDom                      |     100 |      100 |     100 |     100 |
  GetAgentModePickerPopOverVirtualDom.ts                  |     100 |      100 |     100 |     100 |
 GetAgentModePickerVirtualDom                             |     100 |      100 |     100 |     100 |
  GetAgentModePickerVirtualDom.ts                         |     100 |      100 |     100 |     100 |
 GetAiResponse                                            |    62.9 |    52.33 |   86.66 |   62.01 |
  GetAiResponse.ts                                        |    62.9 |    52.33 |   86.66 |   62.01 | 54,58,64-71,75-82,87,93-144,192-193,232,258,305-359,437-438,573,594
 GetAiSessionTitle                                        |   72.72 |       50 |     100 |   72.72 |
  GetAiSessionTitle.ts                                    |   72.72 |       50 |     100 |   72.72 | 27,32-33,37,40,43
 GetAuthState                                             |     100 |      100 |     100 |     100 |
  GetAuthState.ts                                         |     100 |      100 |     100 |     100 |
 GetBackButtonVirtualDom                                  |     100 |      100 |     100 |     100 |
  GetBackButtonVirtualDom.ts                              |     100 |      100 |     100 |     100 |
 GetBackToChatsButtonDom                                  |     100 |      100 |     100 |     100 |
  GetBackToChatsButtonDom.ts                              |     100 |      100 |     100 |     100 |
 GetBackendErrorMessage                                   |   91.66 |     87.5 |     100 |   91.66 |
  GetBackendErrorMessage.ts                               |   91.66 |     87.5 |     100 |   91.66 | 29
 GetBasicChatTools                                        |   90.47 |    83.33 |      80 |      90 |
  GetBasicChatTools.ts                                    |   90.47 |    83.33 |      80 |      90 | 8,45
 GetBlobBase64                                            |     100 |      100 |     100 |     100 |
  GetBlobBase64.ts                                        |     100 |      100 |     100 |     100 |
 GetChatDetailsDomBody                                    |      50 |        0 |       0 |      50 |
  GetChatDetailsDomBody.ts                                |      50 |        0 |       0 |      50 | 35
 GetChatHeaderActionsDom                                  |     100 |       80 |     100 |     100 |
  GetChatHeaderActionsDom.ts                              |     100 |       80 |     100 |     100 | 10
 GetChatHeaderAuthDom                                     |      92 |    82.75 |     100 |      92 |
  GetChatHeaderAuthDom.ts                                 |      92 |    82.75 |     100 |      92 | 19,29
 GetChatHeaderDomDetailMode                               |   85.71 |    33.33 |     100 |   85.71 |
  GetChatHeaderDomDetailMode.ts                           |   85.71 |    33.33 |     100 |   85.71 | 13
 GetChatHeaderDomFocusMode                                |     100 |    33.33 |     100 |     100 |
  GetChatHeaderDomFocusMode.ts                            |     100 |    33.33 |     100 |     100 | 24-82
 GetChatHeaderDomListMode                                 |     100 |    63.15 |     100 |     100 |
  GetChatHeaderDomListMode.ts                             |     100 |    63.15 |     100 |     100 | 11-17
 GetChatListDom                                           |     100 |    66.66 |     100 |     100 |
  GetChatListDom.ts                                       |     100 |    66.66 |     100 |     100 | 13
 GetChatMessageDom                                        |   76.74 |    83.33 |     100 |   76.74 |
  GetChatMessageDom.ts                                    |   76.74 |    83.33 |     100 |   76.74 | 23-27,31,38-42,46,54,100
 GetChatMessageOpenAiContent                              |     100 |       90 |     100 |     100 |
  GetChatMessageOpenAiContent.ts                          |     100 |       90 |     100 |     100 | 10
 GetChatMessageOpenAiContent/GetAttachmentTextPart        |      50 |       25 |     100 |      50 |
  GetAttachmentTextPart.ts                                |      50 |       25 |     100 |      50 | 7-17
 GetChatModeChatFocusVirtualDom                           |     100 |     41.5 |     100 |     100 |
  GetChatModeChatFocusVirtualDom.ts                       |     100 |     41.5 |     100 |     100 | 88-142,146,156
 GetChatModeDetailVirtualDom                              |     100 |    44.44 |     100 |     100 |
  GetChatModeDetailVirtualDom.ts                          |     100 |    44.44 |     100 |     100 | 77-123
 GetChatModeListVirtualDom                                |     100 |     43.9 |     100 |     100 |
  GetChatModeListVirtualDom.ts                            |     100 |     43.9 |     100 |     100 | 66-106
 GetChatModeUnsupportedVirtualDom                         |      50 |      100 |       0 |      50 |
  GetChatModeUnsupportedVirtualDom.ts                     |      50 |      100 |       0 |      50 | 5
 GetChatModelListIemVirtualDom                            |     100 |    83.33 |     100 |     100 |
  GetChatModelListItemVirtualDom.ts                       |     100 |    83.33 |     100 |     100 | 18
 GetChatModelListVirtualDom                               |     100 |      100 |     100 |     100 |
  GetChatModelListVirtualDom.ts                           |     100 |      100 |     100 |     100 |
 GetChatModelPickerPopOverVirtualDom                      |     100 |      100 |     100 |     100 |
  GetChatModelPickerPopOverVirtualDom.ts                  |     100 |      100 |     100 |     100 |
 GetChatModelPickerToggleVirtualDom                       |     100 |       50 |     100 |     100 |
  GetChatModelPickerToggleVirtualDom.ts                   |     100 |       50 |     100 |     100 | 14
 GetChatOverlaysVirtualDom                                |     100 |       95 |     100 |     100 |
  GetChatOverlaysVirtualDom.ts                            |     100 |       95 |     100 |     100 | 46
 GetChatSearchDom                                         |     100 |      100 |     100 |     100 |
  GetChatSearchDom.ts                                     |     100 |      100 |     100 |     100 |
 GetChatSendAreaDom                                       |     100 |    86.27 |     100 |     100 |
  GetChatSendAreaDom.ts                                   |     100 |    86.27 |     100 |     100 | 52-54,66,71,105,108
 GetChatSendAreaDom/GetComposerAttachmentClassName        |   57.14 |       40 |     100 |   57.14 |
  GetComposerAttachmentClassName.ts                       |   57.14 |       40 |     100 |   57.14 | 7,11,15
 GetChatSendAreaDom/GetComposerAttachmentLabel            |   57.14 |       40 |     100 |   57.14 |
  GetComposerAttachmentLabel.ts                           |   57.14 |       40 |     100 |   57.14 | 6,10,14
 GetChatSendAreaDom/GetComposerAttachmentPreviewDom       |      75 |       50 |     100 |      75 |
  GetComposerAttachmentPreviewDom.ts                      |      75 |       50 |     100 |      75 | 11
 GetChatSendAreaDom/GetComposerAttachmentRemoveButtonDom  |     100 |      100 |     100 |     100 |
  GetComposerAttachmentRemoveButtonDom.ts                 |     100 |      100 |     100 |     100 |
 GetChatSendAreaDom/GetComposerAttachmentsDom             |     100 |       75 |     100 |     100 |
  GetComposerAttachmentsDom.ts                            |     100 |       75 |     100 |     100 | 26
 GetChatSendAreaDom/GetComposerTextAreaDom                |     100 |      100 |     100 |     100 |
  GetComposerTextAreaDom.ts                               |     100 |      100 |     100 |     100 |
 GetChatSessionStatus                                     |     100 |      100 |     100 |     100 |
  GetChatSessionStatus.ts                                 |     100 |      100 |     100 |     100 |
 GetChatViewDom                                           |   88.88 |    17.14 |     100 |   88.23 |
  GetChatViewDom.ts                                       |   88.88 |    17.14 |     100 |   88.23 | 25,331
 GetClientRequestIdHeader                                 |     100 |      100 |     100 |     100 |
  GetClientRequestIdHeader.ts                             |     100 |      100 |     100 |     100 |
 GetCommandHelpText                                       |     100 |      100 |     100 |     100 |
  GetCommandHelpText.ts                                   |     100 |      100 |     100 |     100 |
 GetComposerAttachmentDisplayType                         |   83.33 |    83.33 |     100 |   83.33 |
  GetComposerAttachmentDisplayType.ts                     |   83.33 |    83.33 |     100 |   83.33 | 13
 GetComposerAttachmentDisplayType/IsImageFile             |     100 |      100 |     100 |     100 |
  IsImageFile.ts                                          |     100 |      100 |     100 |     100 |
 GetComposerAttachmentDisplayType/IsTextFile              |     100 |       50 |     100 |     100 |
  IsTextFile.ts                                           |     100 |       50 |     100 |     100 | 4
 GetComposerAttachmentDisplayType/IsValidImage            |   35.71 |       60 |     100 |   35.71 |
  IsValidImage.ts                                         |   35.71 |       60 |     100 |   35.71 | 10,14-24
 GetComposerAttachmentDisplayType/IsValidJpeg             |   33.33 |        0 |       0 |   33.33 |
  IsValidJpeg.ts                                          |   33.33 |        0 |       0 |   33.33 | 2-3
 GetComposerAttachmentDisplayType/IsValidPng              |   85.71 |       50 |     100 |   83.33 |
  IsValidPng.ts                                           |   85.71 |       50 |     100 |   83.33 | 6
 GetComposerAttachmentPreviewOverlayVirtualDom            |      40 |    11.11 |   33.33 |   44.44 |
  GetComposerAttachmentPreviewOverlayVirtualDom.ts        |      40 |    11.11 |   33.33 |   44.44 | 9,31-35
 GetComposerAttachmentPreviewSrc                          |     100 |      100 |     100 |     100 |
  GetComposerAttachmentPreviewSrc.ts                      |     100 |      100 |     100 |     100 |
 GetComposerAttachmentTextContent                         |     100 |      100 |     100 |     100 |
  GetComposerAttachmentTextContent.ts                     |     100 |      100 |     100 |     100 |
 GetComposerAttachments                                   |     100 |      100 |     100 |     100 |
  GetComposerAttachments.ts                               |     100 |      100 |     100 |     100 |
 GetComposerAttachmentsHeight                             |     100 |      100 |     100 |     100 |
  ComposerAttachmentLayoutConstants.ts                    |     100 |      100 |     100 |     100 |
  GetComposerAttachmentsHeight.ts                         |     100 |      100 |     100 |     100 |
 GetComposerAttachmentsHeight/GetAttachmentContainerWidth |     100 |      100 |     100 |     100 |
  GetAttachmentContainerWidth.ts                          |     100 |      100 |     100 |     100 |
 GetComposerAttachmentsHeight/GetComposerAttachmentLabel  |   57.14 |       40 |     100 |   57.14 |
  GetComposerAttachmentLabel.ts                           |   57.14 |       40 |     100 |   57.14 | 6,10,14
 GetComposerAttachmentsHeight/GetComposerAttachmentWidth  |     100 |      100 |     100 |     100 |
  GetComposerAttachmentWidth.ts                           |     100 |      100 |     100 |     100 |
 GetComposerHeight/GetComposerHeight                      |   85.71 |       80 |     100 |   85.71 |
  GetComposerHeight.ts                                    |   85.71 |       80 |     100 |   85.71 | 20-21
 GetComposerWidth                                         |     100 |      100 |     100 |     100 |
  GetComposerWidth.ts                                     |     100 |      100 |     100 |     100 |
 GetCreatePullRequestButtonDom                            |     100 |      100 |     100 |     100 |
  GetCreatePullRequestButtonDom.ts                        |     100 |      100 |     100 |     100 |
 GetCss                                                   |    12.5 |      100 |       0 |    12.5 |
  GetCss.ts                                               |    12.5 |      100 |       0 |    12.5 | 21-495
 GetCustomSelectOptionVirtualDom                          |     100 |      100 |     100 |     100 |
  GetCustomSelectOptionVirtualDom.ts                      |     100 |      100 |     100 |     100 |
 GetCustomSelectPickerToggleVirtualDom                    |     100 |      100 |     100 |     100 |
  GetCustomSelectPickerToggleVirtualDom.ts                |     100 |      100 |     100 |     100 |
 GetCustomSelectPopOverVirtualDom                         |     100 |      100 |     100 |     100 |
  GetCustomSelectPopOverVirtualDom.ts                     |     100 |      100 |     100 |     100 |
 GetCustomSelectToggleVirtualDom                          |     100 |    66.66 |     100 |     100 |
  GetCustomSelectToggleVirtualDom.ts                      |     100 |    66.66 |     100 |     100 | 9-11
 GetDefaultModels                                         |     100 |      100 |     100 |     100 |
  GetDefaultModels.ts                                     |     100 |      100 |     100 |     100 |
 GetDefaultModels/GetDefaultModelsOpenAi                  |     100 |      100 |     100 |     100 |
  GetDefaultModelsOpenAi.ts                               |     100 |      100 |     100 |     100 |
 GetDefaultModels/GetDefaultModelsOpenRouter              |     100 |      100 |     100 |     100 |
  GetDefaultModelsOpenRouter.ts                           |     100 |      100 |     100 |     100 |
 GetDefaultModels/GetDefaultModelsTest                    |     100 |      100 |     100 |     100 |
  GetDefaultModelsTest.ts                                 |     100 |      100 |     100 |     100 |
 GetDefaultSystemPrompt                                   |     100 |      100 |     100 |     100 |
  GetDefaultSystemPrompt.ts                               |     100 |      100 |     100 |     100 |
 GetDropOverlayVirtualDom                                 |     100 |      100 |     100 |     100 |
  GetDropOverlayVirtualDom.ts                             |     100 |      100 |     100 |     100 |
 GetDroppedFiles                                          |      70 |       50 |   66.66 |   66.66 |
  GetDroppedFiles.ts                                      |      70 |       50 |   66.66 |   66.66 | 10-13
 GetEmptyChatSessionsDom                                  |     100 |      100 |     100 |     100 |
  GetEmptyChatSessionsDom.ts                              |     100 |      100 |     100 |     100 |
 GetEmptyMessagesDom                                      |     100 |      100 |     100 |     100 |
  GetEmptyMessagesDom.ts                                  |     100 |      100 |     100 |     100 |
 GetFileNameFromUri                                       |     100 |       75 |     100 |     100 |
  GetFileNameFromUri.ts                                   |     100 |       75 |     100 |     100 | 8
 GetGitBranchPickerVirtualDom                             |      84 |       50 |     100 |   83.33 |
  GetGitBranchPickerVirtualDom.ts                         |      84 |       50 |     100 |   83.33 | 17-20,39
 GetGitBranches                                           |      90 |       50 |     100 |      90 |
  GetGitBranches.ts                                       |      90 |       50 |     100 |      90 | 11,33
 GetGitBranches/CollectBranchNames                        |   83.33 |       50 |     100 |   83.33 |
  CollectBranchNames.ts                                   |   83.33 |       50 |     100 |   83.33 | 12-13
 GetGitBranches/DecodeFileContent                         |    37.5 |    16.66 |     100 |    37.5 |
  DecodeFileContent.ts                                    |    37.5 |    16.66 |     100 |    37.5 | 5-11
 GetGitBranches/GetGitDirUri                              |   63.63 |        0 |     100 |   63.63 |
  GetGitDirUri.ts                                         |   63.63 |        0 |     100 |   63.63 | 16-20
 GetGitBranches/GetRelativePath                           |   83.33 |    77.77 |      50 |    90.9 |
  GetRelativePath.ts                                      |   83.33 |    77.77 |      50 |    90.9 | 3
 GetGitBranches/HasGitRepository                          |     100 |      100 |     100 |     100 |
  HasGitRepository.ts                                     |     100 |      100 |     100 |     100 |
 GetGitBranches/ParseCurrentBranch                        |   83.33 |       50 |     100 |   83.33 |
  ParseCurrentBranch.ts                                   |   83.33 |       50 |     100 |   83.33 | 8
 GetGitBranches/ParseEntries                              |   63.63 |    38.46 |     100 |      60 |
  ParseEntries.ts                                         |   63.63 |    38.46 |     100 |      60 | 10,20-26
 GetGitBranches/ReadDir                                   |     100 |      100 |     100 |     100 |
  ReadDir.ts                                              |     100 |      100 |     100 |     100 |
 GetGitBranches/ReadTextFile                              |     100 |      100 |     100 |     100 |
  ReadTextFile.ts                                         |     100 |      100 |     100 |     100 |
 GetGitBranches/ToFileSystemPath                          |      75 |       50 |     100 |      75 |
  ToFileSystemPath.ts                                     |      75 |       50 |     100 |      75 | 3
 GetGitBranches/ToFileSystemTarget                        |   83.33 |       75 |     100 |   83.33 |
  ToFileSystemTarget.ts                                   |   83.33 |       75 |     100 |   83.33 | 8
 GetGitBranches/ToGitUri                                  |     100 |       50 |     100 |     100 |
  ToGitUri.ts                                             |     100 |       50 |     100 |     100 | 4
 GetGlobMatchCount                                        |   76.66 |    66.66 |     100 |   76.66 |
  GetGlobMatchCount.ts                                    |   76.66 |    66.66 |     100 |   76.66 | 4,8,16,20,24,37,43
 GetHeaderActionVirtualDom                                |     100 |       50 |     100 |     100 |
  GetHeaderActionVirtualDom.ts                            |     100 |       50 |     100 |     100 | 5
 GetInlineNodeDom                                         |   78.57 |    66.66 |   78.57 |   78.57 |
  GetBoldInlineNodeDom.ts                                 |     100 |      100 |     100 |     100 |
  GetImageAltText.ts                                      |      75 |       50 |     100 |      75 | 5
  GetImageInlineNodeDom.ts                                |     100 |      100 |     100 |     100 |
  GetInlineCodeInlineNodeDom.ts                           |      50 |      100 |       0 |      50 | 5
  GetInlineNodeDom.ts                                     |   61.53 |       60 |     100 |   61.53 | 19,27-29,33-34
  GetItalicInlineNodeDom.ts                               |     100 |      100 |     100 |     100 |
  GetLinkInlineNodeDom.ts                                 |     100 |      100 |     100 |     100 |
  GetMathInlineNodeDom.ts                                 |     100 |       50 |     100 |     100 | 5
  GetStrikethroughInlineNodeDom.ts                        |   33.33 |      100 |       0 |   33.33 | 11-17
  GetTextInlineNodeDom.ts                                 |     100 |      100 |     100 |     100 |
  IsFileReferenceUri.ts                                   |     100 |      100 |     100 |     100 |
 GetKeyBindings                                           |     100 |      100 |     100 |     100 |
  GetKeyBindings.ts                                       |     100 |      100 |     100 |     100 |
 GetListFocusIndex                                        |   71.42 |       50 |     100 |   71.42 |
  GetListFocusIndex.ts                                    |   71.42 |       50 |     100 |   71.42 | 7,10
 GetListIndex                                             |     100 |      100 |     100 |     100 |
  GetListIndex.ts                                         |     100 |      100 |     100 |     100 |
 GetMaxComposerHeight                                     |     100 |      100 |     100 |     100 |
  GetMaxComposerHeight.ts                                 |     100 |      100 |     100 |     100 |
 GetMentionContextMessage                                 |    92.3 |       75 |     100 |    92.3 |
  GetMentionContextMessage.ts                             |    92.3 |       75 |     100 |    92.3 | 20
 GetMenuEntries                                           |   11.11 |        0 |       0 |   11.11 |
  GetMenuEntries.ts                                       |   11.11 |        0 |       0 |   11.11 | 19-33
 GetMenuEntriesChatAttachment                             |      50 |      100 |       0 |      50 |
  GetMenuEntriesChatAttachment.ts                         |      50 |      100 |       0 |      50 | 6
 GetMenuEntriesChatHeader                                 |      50 |      100 |       0 |      50 |
  GetMenuEntriesChatHeader.ts                             |      50 |      100 |       0 |      50 | 7
 GetMenuEntriesChatInput                                  |      50 |      100 |       0 |      50 |
  GetMenuEntriesChatInput.ts                              |      50 |      100 |       0 |      50 | 6
 GetMenuEntriesChatList                                   |     100 |      100 |     100 |     100 |
  GetMenuEntriesChatList.ts                               |     100 |      100 |     100 |     100 |
 GetMenuEntriesChatProjectList                            |     100 |      100 |     100 |     100 |
  GetMenuEntriesChatProjectList.ts                        |     100 |      100 |     100 |     100 |
 GetMenuEntriesProjectAddButton                           |     100 |      100 |     100 |     100 |
  GetMenuEntriesProjectAddButton.ts                       |     100 |      100 |     100 |     100 |
 GetMenuEntryIds                                          |    87.5 |      100 |       0 |    87.5 |
  GetMenuEntryIds.ts                                      |    87.5 |      100 |       0 |    87.5 | 11
 GetMessageById                                           |     100 |      100 |     100 |     100 |
  GetMessageById.ts                                       |     100 |      100 |     100 |     100 |
 GetMessageContentDom                                     |     100 |        0 |     100 |     100 |
  GetMessageContentDom.ts                                 |     100 |        0 |     100 |     100 | 5
 GetMessageNodeDom                                        |   91.95 |    84.12 |     100 |   91.86 |
  GetBlockQuoteDom.ts                                     |     100 |      100 |     100 |     100 |
  GetCodeBlockDom.ts                                      |     100 |      100 |     100 |     100 |
  GetHeadingDom.ts                                        |     100 |      100 |     100 |     100 |
  GetHeadingElementType.ts                                |      50 |    33.33 |     100 |      50 | 9,13-17
  GetMessageNodeDom.ts                                    |   92.59 |    90.47 |     100 |   92.59 | 52,55
  GetOrderedListItemDom.ts                                |   95.83 |     87.5 |     100 |   95.83 | 23
  GetTableBodyCellDom.ts                                  |     100 |      100 |     100 |     100 |
  GetTableDom.ts                                          |     100 |      100 |     100 |     100 |
  GetTableHeadCellDom.ts                                  |     100 |      100 |     100 |     100 |
  GetTableRowDom.ts                                       |     100 |      100 |     100 |     100 |
  GetUnorderedListItemDom.ts                              |     100 |      100 |     100 |     100 |
  HasVisibleInlineContent.ts                              |     100 |      100 |     100 |     100 |
 GetMessagesDom                                           |    90.9 |    85.71 |     100 |   90.69 |
  GetMessagesDom.ts                                       |    90.9 |    85.71 |     100 |   90.69 | 28,80-84
 GetMinComposerHeight                                     |     100 |      100 |     100 |     100 |
  GetMinComposerHeight.ts                                 |     100 |      100 |     100 |     100 |
 GetMinComposerHeightForState                             |     100 |      100 |     100 |     100 |
  GetMinComposerHeightForState.ts                         |     100 |      100 |     100 |     100 |
 GetMissingApiKeyDom                                      |     100 |    55.55 |     100 |     100 |
  GetMissingApiKeyDom.ts                                  |     100 |    55.55 |     100 |     100 | 11-13,56-58
 GetMissingOpenApiApiKeyDom                               |     100 |       50 |     100 |     100 |
  GetMissingOpenApiApiKeyDom.ts                           |     100 |       50 |     100 |     100 | 9-12,28
 GetMissingOpenRouterApiKeyDom                            |     100 |    66.66 |     100 |     100 |
  GetMissingOpenRouterApiKeyDom.ts                        |     100 |    66.66 |     100 |     100 | 7
 GetMockAiResponse                                        |      75 |       50 |     100 |      75 |
  GetMockAiResponse.ts                                    |      75 |       50 |     100 |      75 | 5
 GetMockOpenApiAssistantText                              |   48.52 |    27.46 |   54.54 |   48.52 |
  GetMockOpenApiAssistantText.ts                          |   48.52 |    27.46 |   54.54 |   48.52 | 24-61,66,70,75,78,84,100,111-121,133,159,173-239,254,266,273,285-288,293-294
 GetMockOpenApiRequests                                   |      50 |      100 |       0 |      50 |
  GetMockOpenApiRequests.ts                               |      50 |      100 |       0 |      50 | 5
 GetMockOpenRouterAssistantText                           |   71.42 |       50 |     100 |   71.42 |
  GetMockOpenRouterAssistantText.ts                       |   71.42 |       50 |     100 |   71.42 | 20,44
 GetModelLabel                                            |     100 |      100 |     100 |     100 |
  GetModelLabel.ts                                        |     100 |      100 |     100 |     100 |
 GetModelOptionDom                                        |     100 |      100 |     100 |     100 |
  GetModelOptionDom.ts                                    |     100 |      100 |     100 |     100 |
 GetModelPickerClickIndex                                 |     100 |      100 |     100 |     100 |
  GetModelPickerClickIndex.ts                             |     100 |      100 |     100 |     100 |
 GetModelPickerHeaderDom                                  |     100 |      100 |     100 |     100 |
  GetModelPickerHeaderDom.ts                              |     100 |      100 |     100 |     100 |
 GetModelPickerHeight                                     |   83.33 |      100 |      50 |   83.33 |
  GetModelPickerHeight.ts                                 |   83.33 |      100 |      50 |   83.33 | 9
 GetNextAutoScrollTop                                     |     100 |      100 |     100 |     100 |
  GetNextAutoScrollTop.ts                                 |     100 |      100 |     100 |     100 |
 GetNextChatHistoryState                                  |    7.69 |        0 |       0 |    7.69 |
  GetNextChatHistoryState.ts                              |    7.69 |        0 |       0 |    7.69 | 6-9,13-56
 GetNextHandleTextChunkState                              |     100 |       50 |     100 |     100 |
  GetNextHandleTextChunkState.ts                          |     100 |       50 |     100 |     100 | 12
 GetNextSelectedSessionId                                 |   66.66 |       50 |     100 |    62.5 |
  GetNextSelectedSessionId.ts                             |   66.66 |       50 |     100 |    62.5 | 5,11-12
 GetNoMatchingModelsFoundVirtualDom                       |     100 |      100 |     100 |     100 |
  GetNoMatchingModelsFoundVirtualDom.ts                   |     100 |      100 |     100 |     100 |
 GetNormalizedComposerSelection                           |   93.75 |     87.5 |     100 |   93.75 |
  GetNormalizedComposerSelection.ts                       |   93.75 |     87.5 |     100 |   93.75 | 3
 GetOpenApiApiEndpoint                                    |     100 |      100 |     100 |     100 |
  GetOpenApiApiEndpoint.ts                                |     100 |      100 |     100 |     100 |
 GetOpenApiAssistantText                                  |      55 |     47.2 |   61.11 |   54.81 |
  GetOpenApiAssistantText.ts                              |      55 |     47.2 |   61.11 |   54.81 | 26,31,110-122,133,141,147,189,192,197,208-220,225,238-262,267,276,280,286,302,318-368,378,399,406,441,445,455,474,486,503,529,533,562,590-619,626,640,651,659-670,692-711,734-753,773-786,846-886,901,908-909,1017-1056,1070,1077-1078,1103,1111,1119,1124-1185,1200,1207,1214-1285,1294
 GetOpenApiErrorMessage                                   |     100 |    95.34 |     100 |     100 |
  GetOpenApiErrorMessage.ts                               |     100 |    95.34 |     100 |     100 | 61-64
 GetOpenApiModelId                                        |   66.66 |       25 |     100 |   66.66 |
  GetOpenApiModelId.ts                                    |   66.66 |       25 |     100 |   66.66 | 8-11
 GetOpenRouterApiEndpoint                                 |     100 |      100 |     100 |     100 |
  GetOpenRouterApiEndpoint.ts                             |     100 |      100 |     100 |     100 |
 GetOpenRouterAssistantText                               |   61.66 |    54.74 |      80 |   61.34 |
  GetOpenRouterAssistantText.ts                           |   61.66 |    54.74 |      80 |   61.34 | 41,46,51,56,64-89,99-110,122,132,137,142,179,221-270,323,333,341,348,355,362,373,378,418
 GetOpenRouterErrorMessage                                |     100 |    66.66 |     100 |     100 |
  GetOpenRouterErrorMessage.ts                            |     100 |    66.66 |     100 |     100 | 6
 GetOpenRouterKeyEndpoint                                 |     100 |      100 |     100 |     100 |
  GetOpenRouterKeyEndpoint.ts                             |     100 |      100 |     100 |     100 |
 GetOpenRouterModelId                                     |     100 |      100 |     100 |     100 |
  GetOpenRouterModelId.ts                                 |     100 |      100 |     100 |     100 |
 GetOpenRouterRequestFailedDom                            |     100 |      100 |     100 |     100 |
  GetOpenRouterRequestFailedDom.ts                        |     100 |      100 |     100 |     100 |
 GetOpenRouterTooManyRequestsDom                          |     100 |      100 |     100 |     100 |
  GetOpenRouterTooManyRequestsDom.ts                      |     100 |      100 |     100 |     100 |
 GetOpenRouterTooManyRequestsMessage                      |   90.47 |    61.11 |     100 |   90.47 |
  GetOpenRouterTooManyRequestsMessage.ts                  |   90.47 |    61.11 |     100 |   90.47 | 7,18
 GetProjectListDom                                        |     100 |       60 |     100 |     100 |
  GetProjectListDom.ts                                    |     100 |       60 |     100 |     100 | 17-19,30-52
 GetProjectListDom/GetProjectGroupDom                     |     100 |     87.5 |     100 |     100 |
  GetProjectGroupDom.ts                                   |     100 |     87.5 |     100 |     100 | 19
 GetProjectListDom/GetProjectSessionDom                   |     100 |       50 |     100 |     100 |
  GetProjectSessionDom.ts                                 |     100 |       50 |     100 |     100 | 10
 GetQuickPickMenuEntries                                  |      50 |      100 |       0 |      50 |
  GetQuickPickMenuEntries.ts                              |      50 |      100 |       0 |      50 | 2
 GetReadFileTarget                                        |   89.58 |    91.11 |     100 |   89.58 |
  GetReadFileTarget.ts                                    |   89.58 |    91.11 |     100 |   89.58 | 4,35,51,54,64
 GetReasoningEffortPickerVirtualDom                       |     100 |       75 |     100 |     100 |
  GetReasoningEffortPickerVirtualDom.ts                   |     100 |       75 |     100 |     100 | 36
 GetRenderHtmlCss                                         |   88.23 |    83.33 |     100 |    87.5 |
  GetRenderHtmlCss.ts                                     |   88.23 |    83.33 |     100 |    87.5 | 14,22
 GetRenderer                                              |    90.9 |    88.88 |     100 |    90.9 |
  GetRenderer.ts                                          |    90.9 |    88.88 |     100 |    90.9 | 19
 GetResponsivePickerState                                 |     100 |      100 |     100 |     100 |
  GetResponsivePickerState.ts                             |     100 |      100 |     100 |     100 |
 GetRunModePickerPopOverVirtualDom                        |     100 |      100 |     100 |     100 |
  GetRunModePickerPopOverVirtualDom.ts                    |     100 |      100 |     100 |     100 |
 GetRunModePickerVirtualDom                               |     100 |      100 |     100 |     100 |
  GetRunModePickerVirtualDom.ts                           |     100 |      100 |     100 |     100 |
 GetSavedAgentMode                                        |   66.66 |       50 |     100 |   66.66 |
  GetSavedAgentMode.ts                                    |   66.66 |       50 |     100 |   66.66 | 13-16
 GetSavedChatListScrollTop                                |     100 |      100 |     100 |     100 |
  GetSavedChatListScrollTop.ts                            |     100 |      100 |     100 |     100 |
 GetSavedComposerSelection                                |     100 |      100 |     100 |     100 |
  GetSavedComposerSelection.ts                            |     100 |      100 |     100 |     100 |
 GetSavedComposerValue                                    |     100 |      100 |     100 |     100 |
  GetSavedComposerValue.ts                                |     100 |      100 |     100 |     100 |
 GetSavedLastNormalViewMode                               |   85.71 |    83.33 |     100 |   85.71 |
  GetSavedLastNormalViewMode.ts                           |   85.71 |    83.33 |     100 |   85.71 | 12
 GetSavedMessagesScrollTop                                |     100 |      100 |     100 |     100 |
  GetSavedMessagesScrollTop.ts                            |     100 |      100 |     100 |     100 |
 GetSavedProjectExpandedIds                               |   54.54 |       50 |      50 |      60 |
  GetSavedProjectExpandedIds.ts                           |   54.54 |       50 |      50 |      60 | 12-16
 GetSavedProjectListScrollTop                             |   85.71 |       75 |     100 |   85.71 |
  GetSavedProjectListScrollTop.ts                         |   85.71 |       75 |     100 |   85.71 | 12
 GetSavedProjectSidebarWidth                              |   85.71 |       75 |     100 |   85.71 |
  GetSavedProjectSidebarWidth.ts                          |   85.71 |       75 |     100 |   85.71 | 12
 GetSavedProjects                                         |   46.15 |    27.27 |      50 |   46.15 |
  GetSavedProjects.ts                                     |   46.15 |    27.27 |      50 |   46.15 | 13-22
 GetSavedReasoningEffort                                  |   66.66 |       50 |     100 |   66.66 |
  GetSavedReasoningEffort.ts                              |   66.66 |       50 |     100 |   66.66 | 13-16
 GetSavedSelectedModelId                                  |     100 |      100 |     100 |     100 |
  GetSavedSelectedModelId.ts                              |     100 |      100 |     100 |     100 |
 GetSavedSelectedProjectId                                |   85.71 |       75 |     100 |   85.71 |
  GetSavedSelectedProjectId.ts                            |   85.71 |       75 |     100 |   85.71 | 12
 GetSavedSelectedSessionId                                |     100 |      100 |     100 |     100 |
  GetSavedSelectedSessionId.ts                            |     100 |      100 |     100 |     100 |
 GetSavedSessions                                         |     100 |      100 |     100 |     100 |
  GetSavedSessions.ts                                     |     100 |      100 |     100 |     100 |
 GetSavedViewMode                                         |     100 |      100 |     100 |     100 |
  GetSavedViewMode.ts                                     |     100 |      100 |     100 |     100 |
 GetScrollDownButtonDom                                   |     100 |      100 |     100 |     100 |
  GetScrollDownButtonDom.ts                               |     100 |      100 |     100 |     100 |
 GetSelectedComposerValue                                 |     100 |      100 |     100 |     100 |
  GetSelectedComposerValue.ts                             |     100 |      100 |     100 |     100 |
 GetSelectedSession                                       |     100 |      100 |     100 |     100 |
  GetSelectedSession.ts                                   |     100 |      100 |     100 |     100 |
 GetSelectedSessionId                                     |      50 |      100 |       0 |      50 |
  GetSelectedSessionId.ts                                 |      50 |      100 |       0 |      50 | 4
 GetSendButtonClassName                                   |     100 |      100 |     100 |     100 |
  GetSendButtonClassName.ts                               |     100 |      100 |     100 |     100 |
 GetSendButtonDom                                         |     100 |      100 |     100 |     100 |
  GetSendButtonDom.ts                                     |     100 |      100 |     100 |     100 |
 GetSessionDom                                            |     100 |    66.66 |     100 |     100 |
  GetSessionDom.ts                                        |     100 |    66.66 |     100 |     100 | 9
 GetSessionStatusClassName                                |     100 |      100 |     100 |     100 |
  GetSessionStatusClassName.ts                            |     100 |      100 |     100 |     100 |
 GetSlashCommand                                          |      90 |       75 |     100 |      90 |
  GetSlashCommand.ts                                      |      90 |       75 |     100 |      90 | 13
 GetSseEventType                                          |     100 |      100 |     100 |     100 |
  GetSseEventType.ts                                      |     100 |      100 |     100 |     100 |
 GetSystemPrompt                                          |     100 |      100 |     100 |     100 |
  GetSystemPrompt.ts                                      |     100 |      100 |     100 |     100 |
 GetTextContent                                           |   21.42 |     8.33 |     100 |   21.42 |
  GetTextContent.ts                                       |   21.42 |     8.33 |     100 |   21.42 | 5-19
 GetTodoItemClassName                                     |     100 |      100 |     100 |     100 |
  GetTodoItemClassName.ts                                 |     100 |      100 |     100 |     100 |
 GetTodoListDom                                           |     100 |      100 |     100 |     100 |
  GetTodoListDom.ts                                       |     100 |      100 |     100 |     100 |
 GetTodoListItems                                         |     100 |      100 |     100 |     100 |
  GetTodoListItems.ts                                     |     100 |      100 |     100 |     100 |
 GetToolCallArgumentPreview                               |   82.14 |    77.27 |     100 |   82.14 |
  GetToolCallArgumentPreview.ts                           |   82.14 |    77.27 |     100 |   82.14 | 3,9,12,16,31
 GetToolCallAskQuestionVirtualDom                         |     100 |    83.33 |     100 |     100 |
  GetToolCallAskQuestionVirtualDom.ts                     |     100 |    83.33 |     100 |     100 | 42
 GetToolCallCreateDirectoryVirtualDom                     |    87.5 |       50 |     100 |    87.5 |
  GetToolCallCreateDirectoryVirtualDom.ts                 |    87.5 |       50 |     100 |    87.5 | 13
 GetToolCallDefaultDom                                    |     100 |    91.66 |     100 |     100 |
  GetToolCallDefaultDom.ts                                |     100 |    91.66 |     100 |     100 | 11
 GetToolCallDisplayName                                   |     100 |      100 |     100 |     100 |
  GetToolCallDisplayName.ts                               |     100 |      100 |     100 |     100 |
 GetToolCallDom                                           |     100 |    84.37 |     100 |     100 |
  GetToolCallDom.ts                                       |     100 |    84.37 |     100 |     100 | 22,36,43,50,57
 GetToolCallEditFileVirtualDom                            |   85.71 |       50 |     100 |   85.71 |
  GetToolCallEditFileVirtualDom.ts                        |   85.71 |       50 |     100 |   85.71 | 12
 GetToolCallFileNameDom                                   |     100 |       50 |     100 |     100 |
  GetToolCallFileNameDom.ts                               |     100 |       50 |     100 |     100 | 16,23
 GetToolCallGetWorkspaceUriVirtualDom                     |     100 |    66.66 |     100 |     100 |
  GetToolCallGetWorkspaceUriVirtualDom.ts                 |     100 |    66.66 |     100 |     100 | 21-37
 GetToolCallLabel                                         |     100 |      100 |     100 |     100 |
  GetToolCallLabel.ts                                     |     100 |      100 |     100 |     100 |
 GetToolCallMergeKey                                      |      75 |       50 |     100 |      75 |
  GetToolCallMergeKey.ts                                  |      75 |       50 |     100 |      75 | 7
 GetToolCallReadFileVirtualDom                            |   86.36 |    85.29 |     100 |   86.36 |
  GetToolCallReadFileVirtualDom.ts                        |   86.36 |    85.29 |     100 |   86.36 | 18,23,30
 GetToolCallRenderHtmlVirtualDom                          |   88.88 |       50 |     100 |   88.88 |
  GetToolCallRenderHtmlVirtualDom.ts                      |   88.88 |       50 |     100 |   88.88 | 11
 GetToolCallStatusLabel                                   |     100 |      100 |     100 |     100 |
  GetToolCallStatusLabel.ts                               |     100 |      100 |     100 |     100 |
 GetToolCallWriteFileVirtualDom                           |     100 |    81.25 |     100 |     100 |
  GetToolCallWriteFileVirtualDom.ts                       |     100 |    81.25 |     100 |     100 | 20-28
 GetToolCallsDom                                          |      90 |    77.77 |     100 |      90 |
  GetToolCallsDom.ts                                      |      90 |    77.77 |     100 |      90 | 10
 GetTopLevelNodeCount                                     |     100 |      100 |     100 |     100 |
  GetTopLevelNodeCount.ts                                 |     100 |      100 |     100 |     100 |
 GetUsageCostDom                                          |      75 |       50 |     100 |      75 |
  GetUsageCostDom.ts                                      |      75 |       50 |     100 |      75 | 7
 GetUsageCostLabel                                        |     100 |       50 |     100 |     100 |
  GetUsageCostLabel.ts                                    |     100 |       50 |     100 |     100 | 4
 GetUsageOverviewDom                                      |     100 |      100 |     100 |     100 |
  GetUsageOverviewDom.ts                                  |     100 |      100 |     100 |     100 |
 GetVisibleModels                                         |     100 |      100 |     100 |     100 |
  GetVisibleModels.ts                                     |     100 |      100 |     100 |     100 |
 GetVisibleSessions                                       |   88.88 |       75 |     100 |   85.71 |
  GetVisibleSessions.ts                                   |   88.88 |       75 |     100 |   85.71 | 5
 GetWorkspaceUri                                          |     100 |    83.33 |     100 |     100 |
  GetWorkspaceUri.ts                                      |     100 |    83.33 |     100 |     100 | 12
 HandleAgentModeChange                                    |      75 |       50 |     100 |      75 |
  HandleAgentModeChange.ts                                |      75 |       50 |     100 |      75 | 7
 HandleChatDetailWelcomeContextMenu                       |     100 |      100 |     100 |     100 |
  HandleChatDetailWelcomeContextMenu.ts                   |     100 |      100 |     100 |     100 |
 HandleChatHeaderContextMenu                              |     100 |      100 |     100 |     100 |
  HandleChatHeaderContextMenu.ts                          |     100 |      100 |     100 |     100 |
 HandleChatInputContextMenu                               |     100 |      100 |     100 |     100 |
  HandleChatInputContextMenu.ts                           |     100 |      100 |     100 |     100 |
 HandleChatListContextMenu                                |    90.9 |       75 |     100 |    90.9 |
  HandleChatListContextMenu.ts                            |    90.9 |       75 |     100 |    90.9 | 16
 HandleClick                                              |   66.03 |    76.19 |     100 |   66.03 |
  HandleClick.ts                                          |   66.03 |    76.19 |     100 |   66.03 | 45,63-65,81-90,103-123
 HandleClickBack                                          |     100 |      100 |     100 |     100 |
  HandleClickBack.ts                                      |     100 |      100 |     100 |     100 |
 HandleClickClose                                         |     100 |      100 |     100 |     100 |
  HandleClickClose.ts                                     |     100 |      100 |     100 |     100 |
 HandleClickCreateProject                                 |   91.66 |       75 |     100 |    91.3 |
  HandleClickCreateProject.ts                             |   91.66 |       75 |     100 |    91.3 | 11,17
 HandleClickCreatePullRequest                             |   85.71 |    71.42 |     100 |   84.61 |
  HandleClickCreatePullRequest.ts                         |   85.71 |    71.42 |     100 |   84.61 | 10,25
 HandleClickCustomSelectOverlay                           |     100 |      100 |     100 |     100 |
  HandleClickCustomSelectOverlay.ts                       |     100 |      100 |     100 |     100 |
 HandleClickDelete                                        |     100 |        0 |     100 |     100 |
  HandleClickDelete.ts                                    |     100 |        0 |     100 |     100 | 4
 HandleClickDictationButton                               |      50 |      100 |       0 |      50 |
  HandleClickDictationButton.ts                           |      50 |      100 |       0 |      50 | 4
 HandleClickFileName                                      |     100 |      100 |     100 |     100 |
  HandleClickFileName.ts                                  |     100 |      100 |     100 |     100 |
 HandleClickGitBranchPickerToggle                         |      25 |        0 |       0 |      25 |
  HandleClickGitBranchPickerToggle.ts                     |      25 |        0 |       0 |      25 | 6-9
 HandleClickList                                          |     100 |      100 |     100 |     100 |
  HandleClickList.ts                                      |     100 |      100 |     100 |     100 |
 HandleClickLogin                                         |   42.85 |       10 |   33.33 |   42.85 |
  HandleClickLogin.ts                                     |   42.85 |       10 |   33.33 |   42.85 | 16-19,23-24,37,49-50,54-69,79-80
 HandleClickLogout                                        |   71.42 |       50 |     100 |   71.42 |
  HandleClickLogout.ts                                    |   71.42 |       50 |     100 |   71.42 | 13-14
 HandleClickModelPickerList                               |   14.28 |      100 |       0 |   14.28 |
  HandleClickModelPickerList.ts                           |   14.28 |      100 |       0 |   14.28 | 6-11
 HandleClickModelPickerListIndex                          |      20 |        0 |       0 |      20 |
  HandleClickModelPickerListIndex.ts                      |      20 |        0 |       0 |      20 | 5-9
 HandleClickModelPickerOverlay                            |      25 |        0 |       0 |      25 |
  HandleClickModelPickerOverlay.ts                        |      25 |        0 |       0 |      25 | 5-8
 HandleClickModelPickerToggle                             |     100 |      100 |     100 |     100 |
  HandleClickModelPickerToggle.ts                         |     100 |      100 |     100 |     100 |
 HandleClickNew                                           |     100 |      100 |     100 |     100 |
  HandleClickNew.ts                                       |     100 |      100 |     100 |     100 |
 HandleClickOpenApiApiKeySettings                         |     100 |      100 |     100 |     100 |
  HandleClickOpenApiApiKeySettings.ts                     |     100 |      100 |     100 |     100 |
 HandleClickOpenApiApiKeyWebsite                          |     100 |      100 |     100 |     100 |
  HandleClickOpenApiApiKeyWebsite.ts                      |     100 |      100 |     100 |     100 |
 HandleClickOpenRouterApiKeySettings                      |     100 |      100 |     100 |     100 |
  HandleClickOpenRouterApiKeySettings.ts                  |     100 |      100 |     100 |     100 |
 HandleClickOpenRouterApiKeyWebsite                       |     100 |      100 |     100 |     100 |
  HandleClickOpenRouterApiKeyWebsite.ts                   |     100 |      100 |     100 |     100 |
 HandleClickProblems                                      |     100 |      100 |     100 |     100 |
  HandleClickProblems.ts                                  |     100 |      100 |     100 |     100 |
 HandleClickSaveOpenApiApiKey                             |    87.5 |    66.66 |     100 |   86.66 |
  HandleClickSaveOpenApiApiKey.ts                         |    87.5 |    66.66 |     100 |   86.66 | 14,31,43,83
 HandleClickSaveOpenRouterApiKey                          |    87.5 |    66.66 |     100 |   86.66 |
  HandleClickSaveOpenRouterApiKey.ts                      |    87.5 |    66.66 |     100 |   86.66 | 14,31,43,82
 HandleClickSend                                          |     100 |      100 |     100 |     100 |
  HandleClickSend.ts                                      |     100 |      100 |     100 |     100 |
 HandleClickSessionDebug                                  |     100 |      100 |     100 |     100 |
  HandleClickSessionDebug.ts                              |     100 |      100 |     100 |     100 |
 HandleClickSettings                                      |     100 |      100 |     100 |     100 |
  HandleClickSettings.ts                                  |     100 |      100 |     100 |     100 |
 HandleClickStop                                          |   85.71 |       80 |     100 |   84.61 |
  HandleClickStop.ts                                      |   85.71 |       80 |     100 |   84.61 | 8,28
 HandleContextMenuChatImageAttachment                     |   84.61 |    83.33 |      75 |   91.66 |
  HandleContextMenuChatImageAttachment.ts                 |   84.61 |    83.33 |      75 |   91.66 | 12
 HandleContextMenuChatModelPicker                         |     100 |      100 |     100 |     100 |
  HandleContextMenuChatModelPicker.ts                     |     100 |      100 |     100 |     100 |
 HandleContextMenuChatSendAreaBottom                      |      50 |      100 |       0 |      50 |
  HandleContextMenuChatSendAreaBottom.ts                  |      50 |      100 |       0 |      50 | 4
 HandleDragEnter                                          |   72.72 |    66.66 |     100 |   72.72 |
  HandleDragEnter.ts                                      |   72.72 |    66.66 |     100 |   72.72 | 7,10,16
 HandleDragLeave                                          |   66.66 |       50 |     100 |   66.66 |
  HandleDragLeave.ts                                      |   66.66 |       50 |     100 |   66.66 | 6,9
 HandleDragOver                                           |   72.72 |    66.66 |     100 |   72.72 |
  HandleDragOver.ts                                       |   72.72 |    66.66 |     100 |   72.72 | 7,10,16
 HandleDropFiles                                          |   89.47 |    66.66 |     100 |   89.47 |
  HandleDropFiles.ts                                      |   89.47 |    66.66 |     100 |   89.47 | 15,18
 HandleErrorComposerAttachmentPreviewOverlay              |      25 |        0 |       0 |      25 |
  HandleErrorComposerAttachmentPreviewOverlay.ts          |      25 |        0 |       0 |      25 | 4-7
 HandleGitBranchChange                                    |   83.33 |    58.33 |     100 |    82.6 |
  HandleGitBranchChange.ts                                |   83.33 |    58.33 |     100 |    82.6 | 11,16,21,36
 HandleInput                                              |      95 |    78.94 |     100 |   94.73 |
  HandleInput.ts                                          |      95 |    78.94 |     100 |   94.73 | 43
 HandleInputFocus                                         |     100 |    90.47 |     100 |     100 |
  HandleInputFocus.ts                                     |     100 |    90.47 |     100 |     100 | 28-30
 HandleKeyDown                                            |     100 |      100 |     100 |     100 |
  HandleKeyDown.ts                                        |     100 |      100 |     100 |     100 |
 HandleMessagesContextMenu                                |     100 |      100 |     100 |     100 |
  HandleMessagesContextMenu.ts                            |     100 |      100 |     100 |     100 |
 HandleMissingApiKeySubmit                                |      50 |      100 |       0 |      50 |
  HandleMissingApiKeySubmit.ts                            |      50 |      100 |       0 |      50 | 6,10
 HandleModelChange                                        |     100 |      100 |     100 |     100 |
  HandleModelChange.ts                                    |     100 |      100 |     100 |     100 |
 HandleModelInputBlur                                     |     100 |      100 |     100 |     100 |
  HandleModelInputBlur.ts                                 |     100 |      100 |     100 |     100 |
 HandleMouseOut                                           |   16.66 |        0 |       0 |   16.66 |
  HandleMouseOut.ts                                       |   16.66 |        0 |       0 |   16.66 | 6,13-27
 HandleMouseOver                                          |      20 |        0 |       0 |      20 |
  HandleMouseOver.ts                                      |      20 |        0 |       0 |      20 | 6-10
 HandleNewline                                            |   33.33 |      100 |       0 |   33.33 |
  HandleNewline.ts                                        |   33.33 |      100 |       0 |   33.33 | 6-7
 HandlePointerDownModelPickerList                         |      50 |      100 |       0 |      50 |
  HandlePointerDownModelPickerList.ts                     |      50 |      100 |       0 |      50 | 4
 HandlePointerDownProjectSidebarSash                      |      75 |       50 |     100 |      75 |
  HandlePointerDownProjectSidebarSash.ts                  |      75 |       50 |     100 |      75 | 5
 HandlePointerMoveProjectSidebarSash                      |      75 |       50 |     100 |      75 |
  HandlePointerMoveProjectSidebarSash.ts                  |      75 |       50 |     100 |      75 | 6
 HandlePointerUpModelPickerList                           |      50 |        0 |       0 |      50 |
  HandlePointerUpModelPickerList.ts                       |      50 |        0 |       0 |      50 | 4
 HandlePointerUpProjectSidebarSash                        |      80 |       50 |     100 |      80 |
  HandlePointerUpProjectSidebarSash.ts                    |      80 |       50 |     100 |      80 | 6
 HandleProjectAddButtonContextMenu                        |     100 |      100 |     100 |     100 |
  HandleProjectAddButtonContextMenu.ts                    |     100 |      100 |     100 |     100 |
 HandleProjectListContextMenu                             |   82.14 |    58.82 |     100 |   81.48 |
  HandleProjectListContextMenu.ts                         |   82.14 |    58.82 |     100 |   81.48 | 19,24-28,35,39
 HandleReasoningEffortChange                              |     100 |      100 |     100 |     100 |
  HandleReasoningEffortChange.ts                          |     100 |      100 |     100 |     100 |
 HandleRemoveComposerAttachment                           |   88.88 |       75 |     100 |    87.5 |
  HandleRemoveComposerAttachment.ts                       |   88.88 |       75 |     100 |    87.5 | 9
 HandleRunModeChange                                      |   33.33 |        0 |       0 |   33.33 |
  HandleRunModeChange.ts                                  |   33.33 |        0 |       0 |   33.33 | 5,9-12
 HandleScroll                                             |   82.35 |       80 |      75 |   82.35 |
  HandleScroll.ts                                         |   82.35 |       80 |      75 |   82.35 | 31-34
 HandleSearchValueChange                                  |     100 |      100 |     100 |     100 |
  HandleSearchValueChange.ts                              |     100 |      100 |     100 |     100 |
 HandleSubmit                                             |   94.37 |    80.58 |   96.55 |   94.07 |
  HandleSubmit.ts                                         |   94.37 |    80.58 |   96.55 |   94.07 | 38,72,76,83,245-249,305
 HandleTextChunkFunction                                  |   93.54 |    68.75 |     100 |    93.1 |
  HandleTextChunkFunction.ts                              |   93.54 |    68.75 |     100 |    93.1 | 65,78
 HandleToolCallsChunkFunction                             |      80 |       50 |     100 |   78.57 |
  HandleToolCallsChunkFunction.ts                         |      80 |       50 |     100 |   78.57 | 20,26,33
 HasIncompleteJsonArguments                               |     100 |      100 |     100 |     100 |
  HasIncompleteJsonArguments.ts                           |     100 |      100 |     100 |     100 |
 HasLegacyStreamingToolCalls                              |   35.71 |    27.77 |     100 |   35.71 |
  HasLegacyStreamingToolCalls.ts                          |   35.71 |    27.77 |     100 |   35.71 | 3,9-18
 HideComposerAttachmentPreviewOverlay                     |      25 |        0 |       0 |      25 |
  HideComposerAttachmentPreviewOverlay.ts                 |      25 |        0 |       0 |      25 | 4-7
 Id                                                       |     100 |      100 |     100 |     100 |
  Id.ts                                                   |     100 |      100 |     100 |     100 |
 Initialize                                               |     100 |      100 |     100 |     100 |
  Initialize.ts                                           |     100 |      100 |     100 |     100 |
 InitializeChatCoordinatorWorker                          |      80 |      100 |      50 |      80 |
  InitializeChatCoordinatorWorker.ts                      |      80 |      100 |      50 |      80 | 5
 InitializeChatMathWorker                                 |      80 |      100 |      50 |      80 |
  InitializeChatMathWorker.ts                             |      80 |      100 |      50 |      80 | 5
 InitializeChatMessageParsingWorker                       |      80 |      100 |      50 |      80 |
  InitializeChatMessageParsingWorker.ts                   |      80 |      100 |      50 |      80 | 5
 InitializeChatNetworkWorker                              |      80 |      100 |      50 |      80 |
  InitializeChatNetworkWorker.ts                          |      80 |      100 |      50 |      80 | 5
 InitializeChatStorageWorker                              |      80 |      100 |      50 |      80 |
  InitializeChatStorageWorker.ts                          |      80 |      100 |      50 |      80 | 5
 InitializeChatToolWorker                                 |      80 |      100 |      50 |      80 |
  InitializeChatToolWorker.ts                             |      80 |      100 |      50 |      80 | 5
 InitializeClipBoardWorker                                |      80 |      100 |      50 |      80 |
  InitializeClipBoardWorker.ts                            |      80 |      100 |      50 |      80 | 5
 InitializeIconThemeWorker                                |      80 |      100 |      50 |      80 |
  InitializeIconThemeWorker.ts                            |      80 |      100 |      50 |      80 | 5
 InitializeOpenerWorker                                   |      80 |      100 |      50 |      80 |
  InitializeOpenerWorker.ts                               |      80 |      100 |      50 |      80 | 5
 InitializeTextMeasurementWorker                          |      80 |      100 |      50 |      80 |
  InitializeTextMeasurementWorker.ts                      |      80 |      100 |      50 |      80 | 5
 InputName                                                |   92.85 |      100 |   75.67 |   92.85 |
  InputName.ts                                            |   92.85 |      100 |   75.67 |   92.85 | 79,95,107,119,127,131,159,179,207
 IsDefaultSessionTitle                                    |     100 |      100 |     100 |     100 |
  IsDefaultSessionTitle.ts                                |     100 |      100 |     100 |     100 |
 IsObject                                                 |     100 |      100 |     100 |     100 |
  IsObject.ts                                             |     100 |      100 |     100 |     100 |
 IsOpenApiModel                                           |     100 |      100 |     100 |     100 |
  IsOpenApiModel.ts                                       |     100 |      100 |     100 |     100 |
 IsOpenRouterModel                                        |     100 |      100 |     100 |     100 |
  IsOpenRouterModel.ts                                    |     100 |      100 |     100 |     100 |
 IsPathTraversalAttempt                                   |   69.23 |       60 |     100 |   69.23 |
  IsPathTraversalAttempt.ts                               |   69.23 |       60 |     100 |   69.23 | 6,9,12,15
 IsStreamingFunctionCallEvent                             |   78.57 |    83.33 |     100 |   78.57 |
  IsStreamingFunctionCallEvent.ts                         |   78.57 |    83.33 |     100 |   78.57 | 5,8,19
 Listen                                                   |     100 |      100 |     100 |     100 |
  Listen.ts                                               |     100 |      100 |     100 |     100 |
 Listener                                                 |     100 |      100 |     100 |     100 |
  Listener.ts                                             |     100 |      100 |     100 |     100 |
 LoadAiSessionTitleGenerationEnabled                      |     100 |      100 |     100 |     100 |
  LoadAiSessionTitleGenerationEnabled.ts                  |     100 |      100 |     100 |     100 |
 LoadAuthEnabled                                          |     100 |      100 |     100 |     100 |
  LoadAuthEnabled.ts                                      |     100 |      100 |     100 |     100 |
 LoadBackendUrl                                           |     100 |      100 |     100 |     100 |
  LoadBackendUrl.ts                                       |     100 |      100 |     100 |     100 |
 LoadChatHistoryEnabled                                   |     100 |      100 |     100 |     100 |
  LoadChatHistoryEnabled.ts                               |     100 |      100 |     100 |     100 |
 LoadComposerDropEnabled                                  |     100 |      100 |     100 |     100 |
  LoadComposerDropEnabled.ts                              |     100 |      100 |     100 |     100 |
 LoadContent                                              |     100 |    85.07 |     100 |     100 |
  LoadContent.ts                                          |     100 |    85.07 |     100 |     100 | 64,82-83,87-89,100
 LoadEmitStreamingFunctionCallEvents                      |     100 |      100 |     100 |     100 |
  LoadEmitStreamingFunctionCallEvents.ts                  |     100 |      100 |     100 |     100 |
 LoadOpenApiApiKey                                        |    90.9 |       70 |     100 |    90.9 |
  LoadOpenApiApiKey.ts                                    |    90.9 |       70 |     100 |    90.9 | 11
 LoadOpenRouterApiKey                                     |     100 |      100 |     100 |     100 |
  LoadOpenRouterApiKey.ts                                 |     100 |      100 |     100 |     100 |
 LoadPassIncludeObfuscation                               |     100 |      100 |     100 |     100 |
  LoadPassIncludeObfuscation.ts                           |     100 |      100 |     100 |     100 |
 LoadPreferences                                          |     100 |      100 |     100 |     100 |
  LoadPreferences.ts                                      |     100 |      100 |     100 |     100 |
 LoadReasoningPickerEnabled                               |     100 |       50 |     100 |     100 |
  LoadReasoningPickerEnabled.ts                           |     100 |       50 |     100 |     100 | 6
 LoadScrollDownButtonEnabled                              |     100 |      100 |     100 |     100 |
  LoadScrollDownButtonEnabled.ts                          |     100 |      100 |     100 |     100 |
 LoadSearchEnabled                                        |     100 |      100 |     100 |     100 |
  LoadSearchEnabled.ts                                    |     100 |      100 |     100 |     100 |
 LoadSelectedSessionMessages                              |      90 |    83.33 |     100 |      90 |
  LoadSelectedSessionMessages.ts                          |      90 |    83.33 |     100 |      90 | 10
 LoadStreamingEnabled                                     |     100 |      100 |     100 |     100 |
  LoadStreamingEnabled.ts                                 |     100 |      100 |     100 |     100 |
 LoadTodoListToolEnabled                                  |     100 |      100 |     100 |     100 |
  LoadTodoListToolEnabled.ts                              |     100 |      100 |     100 |     100 |
 LoadToolEnablement                                       |     100 |      100 |     100 |     100 |
  LoadToolEnablement.ts                                   |     100 |      100 |     100 |     100 |
 LoadUseChatCoordinatorWorker                             |     100 |      100 |     100 |     100 |
  LoadUseChatCoordinatorWorker.ts                         |     100 |      100 |     100 |     100 |
 LoadUseChatMathWorker                                    |     100 |      100 |     100 |     100 |
  LoadUseChatMathWorker.ts                                |     100 |      100 |     100 |     100 |
 LoadUseChatNetworkWorkerForRequests                      |     100 |      100 |     100 |     100 |
  LoadUseChatNetworkWorkerForRequests.ts                  |     100 |      100 |     100 |     100 |
 LoadUseChatToolWorker                                    |     100 |      100 |     100 |     100 |
  LoadUseChatToolWorker.ts                                |     100 |      100 |     100 |     100 |
 LoadUseOwnBackend                                        |     100 |      100 |     100 |     100 |
  LoadUseOwnBackend.ts                                    |     100 |      100 |     100 |     100 |
 LoadVoiceDictationEnabled                                |     100 |      100 |     100 |     100 |
  LoadVoiceDictationEnabled.ts                            |     100 |      100 |     100 |     100 |
 Logger                                                   |     100 |      100 |     100 |     100 |
  Logger.ts                                               |     100 |      100 |     100 |     100 |
 Main                                                     |     100 |      100 |     100 |     100 |
  Main.ts                                                 |     100 |      100 |     100 |     100 |
 MeasureTextBlockHeight                                   |     100 |      100 |     100 |     100 |
  MeasureTextBlockHeight.ts                               |     100 |      100 |     100 |     100 |
 MergeToolCalls                                           |   94.11 |       80 |     100 |   93.75 |
  MergeToolCalls.ts                                       |   94.11 |       80 |     100 |   93.75 | 6
 MockBackendAuth                                          |   54.54 |       25 |   55.55 |   58.06 |
  MockBackendAuth.ts                                      |   54.54 |       25 |   55.55 |   58.06 | 19,40-51,56,61,64
 MockBackendAuthResponse                                  |      20 |        0 |       0 |      20 |
  MockBackendAuthResponse.ts                              |      20 |        0 |       0 |      20 | 18,22-26,30-46
 MockBackendCompletion                                    |   83.33 |      100 |      50 |   83.33 |
  MockBackendCompletion.ts                                |   83.33 |      100 |      50 |   83.33 | 10
 MockBackendSetHttpErrorResponse                          |   33.33 |      100 |       0 |   33.33 |
  MockBackendSetHttpErrorResponse.ts                      |   33.33 |      100 |       0 |   33.33 | 5-6`

const expectedRowCount = coverageTable
  .split('\n')
  .filter(
    (line) =>
      line.trim() &&
      !line.startsWith('---') &&
      line !== 'File                                                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s',
  ).length

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({
    text: 'ok',
  })
  await Chat.handleInput(coverageTable)

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  const userMessage = messages.nth(0)
  const assistantMessage = messages.nth(1)
  const table = userMessage.locator('.MarkdownTable')
  const headerCells = userMessage.locator('thead th')
  const bodyRows = userMessage.locator('tbody tr')

  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(headerCells).toHaveCount(6)
  await expect(bodyRows).toHaveCount(expectedRowCount)
  await expect(headerCells.nth(0)).toHaveText('File')
  await expect(headerCells.nth(1)).toHaveText('% Stmts')
  await expect(headerCells.nth(5)).toHaveText('Uncovered Line #s')
  await expect(bodyRows.nth(0)).toContainText('All files')
  await expect(bodyRows.nth(0)).toContainText('81.22')
  await expect(bodyRows.nth(1)).toContainText('AgentMode')
  await expect(bodyRows.nth(2)).toContainText('AgentMode.ts')
  await expect(bodyRows.nth(2)).toContainText('18')
  await expect(userMessage).toContainText('GetAiResponse.ts')
  await expect(userMessage).toContainText('54,58,64-71,75-82,87,93-144,192-193,232,258,305-359,437-438,573,594')
  await expect(bodyRows.nth(expectedRowCount - 1)).toContainText('MockBackendSetHttpErrorResponse.ts')
  await expect(assistantMessage).toContainText('ok')
}

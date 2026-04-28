import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewFocus } from '../ChatViewFocus/ChatViewFocus.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ComposerPrimaryControl } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import type { GitBranch } from '../GitBranch/GitBranch.ts'
import type { MockOpenApiRequest } from '../MockOpenApiRequest/MockOpenApiRequest.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { Project } from '../Project/Project.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export interface ChatState {
  readonly addContextButtonEnabled: boolean
  readonly agentMode: AgentMode
  readonly agentModePickerLabelWidth: number
  readonly agentModePickerOpen: boolean
  readonly aiSessionTitleGenerationEnabled: boolean
  readonly assetDir: string
  readonly authAccessToken: string
  readonly authEnabled: boolean
  readonly authErrorMessage: string
  readonly authUseRedirect: boolean
  readonly backendUrl: string
  readonly chatDebugLoggingEnabled: boolean
  readonly chatFocusContentMaxWidth: number
  readonly chatHistoryEnabled: boolean
  readonly chatInputHistory: readonly string[]
  readonly chatInputHistoryDraft: string
  readonly chatInputHistoryIndex: number
  readonly chatListScrollTop: number
  readonly chatMessageFontFamily: string
  readonly chatMessageFontSize: number
  readonly chatMessageLineHeight: number
  readonly chatSendAreaPaddingBottom: number
  readonly chatSendAreaPaddingLeft: number
  readonly chatSendAreaPaddingRight: number
  readonly chatSendAreaPaddingTop: number
  readonly composerAttachmentPreviewOverlayAttachmentId: string
  readonly composerAttachmentPreviewOverlayError: boolean
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerAttachmentsHeight: number
  readonly composerDropActive: boolean
  readonly composerDropEnabled: boolean
  readonly composerFontFamily: string
  readonly composerFontSize: number
  readonly composerHeight: number
  readonly composerLineHeight: number
  readonly composerSelectionEnd: number
  readonly composerSelectionStart: number
  readonly composerValue: string
  readonly disposed?: boolean
  readonly emitStreamingFunctionCallEvents: boolean
  readonly errorCount: number
  readonly focus: ChatViewFocus
  readonly focused: boolean
  readonly gitBranches: readonly GitBranch[]
  readonly gitBranchPickerErrorMessage: string
  readonly gitBranchPickerOpen: boolean
  readonly gitBranchPickerVisible: boolean
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
  readonly headerHeight: number
  readonly height: number
  readonly hiddenPrimaryControls: readonly ComposerPrimaryControl[]
  readonly initial: boolean
  readonly inputSource: 'user' | 'script'
  readonly lastNormalViewMode: 'list' | 'detail'
  readonly lastSubmittedSessionId: string
  readonly listFocusedIndex: number
  readonly listFocusOutline: boolean
  readonly listItemHeight: number
  readonly maxComposerRows: number
  readonly maxToolCalls: number
  readonly messagesAutoScrollEnabled: boolean
  readonly messagesScrollTop: number
  readonly mockAiResponseDelay: number
  readonly mockApiCommandId: string
  readonly mockOpenApiRequests: readonly MockOpenApiRequest[]
  readonly modelPickerHeaderHeight: number
  readonly modelPickerHeight: number
  readonly modelPickerLabelWidth: number
  readonly modelPickerListScrollTop: number
  readonly modelPickerOpen: boolean
  readonly modelPickerSearchValue: string
  readonly models: readonly ChatModel[]
  readonly nextAttachmentId: number
  readonly nextMessageId: number
  readonly openApiApiBaseUrl: string
  readonly openApiApiKey: string
  readonly openApiApiKeyInput: string
  readonly openApiApiKeyInputPattern: string
  readonly openApiApiKeysSettingsUrl: string
  readonly openApiApiKeyState: 'idle' | 'saving'
  readonly openRouterApiBaseUrl: string
  readonly openRouterApiKey: string
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeysSettingsUrl: string
  readonly openRouterApiKeyState: 'idle' | 'saving'
  readonly parsedMessages: readonly ParsedMessage[]
  readonly passIncludeObfuscation: boolean
  readonly platform: number
  readonly primaryControlSelectIconGap: number
  readonly primaryControlSelectIconSize: number
  readonly primaryControlsGap: number
  readonly primaryControlsOverflowButtonLabelWidth: number
  readonly primaryControlsOverflowButtonVisible: boolean
  readonly primaryControlsSubmitButtonWidth: number
  readonly projectExpandedIds: readonly string[]
  readonly projectListScrollTop: number
  readonly projects: readonly Project[]
  readonly projectSidebarResizing: boolean
  readonly projectSidebarWidth: number
  readonly questionToolEnabled?: boolean
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerLabelWidth: number
  readonly reasoningEffortPickerOpen: boolean
  readonly reasoningPickerEnabled: boolean
  readonly renamingSessionId: string
  readonly responsivePickerVisibilityEnabled: boolean
  readonly runMode: RunMode
  readonly runModePickerLabelWidth: number
  readonly runModePickerOpen: boolean
  readonly scrollDownButtonEnabled: boolean
  readonly searchEnabled: boolean
  readonly searchFieldVisible: boolean
  readonly searchValue: string
  readonly selectChevronEnabled: boolean
  readonly selectedModelId: string
  readonly selectedProjectId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly showChatListTime: boolean
  readonly showModelUsageMultiplier: boolean
  readonly showRunMode: boolean
  readonly streamingEnabled: boolean
  readonly systemPrompt: string
  readonly textAreaPaddingBottom: number
  readonly textAreaPaddingLeft: number
  readonly textAreaPaddingRight: number
  readonly textAreaPaddingTop: number
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly toolEnablement: ToolEnablement
  readonly uid: number
  readonly usageOverviewEnabled: boolean
  readonly useAuthWorker: boolean
  readonly useChatCoordinatorWorker: boolean
  readonly useChatMathWorker: boolean
  readonly useChatNetworkWorkerForRequests: boolean
  readonly useChatToolWorker: boolean
  readonly useMockApi: boolean
  readonly useModelWorker: boolean
  readonly useOwnBackend: boolean
  readonly userName: string
  readonly userState: AuthUserState
  readonly userSubscriptionPlan: string
  readonly userUsedTokens: number
  readonly viewMode: ChatViewMode
  readonly visibleModels: readonly ChatModel[]
  readonly visiblePrimaryControls: readonly ComposerPrimaryControl[]
  readonly voiceDictationEnabled: boolean
  readonly warningCount: number
  readonly webSearchEnabled: boolean
  readonly width: number
  readonly x: number
  readonly y: number
}

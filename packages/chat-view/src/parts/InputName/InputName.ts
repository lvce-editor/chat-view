import type { AgentMode as AgentModeType } from '../AgentMode/AgentMode.ts'
import type { ReasoningEffort as ReasoningEffortType } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode as RunModeType } from '../RunMode/RunMode.ts'

export const Notifications = 'Notifications'
export const Problems = 'Problems'
export const Composer = 'composer'
export const Search = 'search'
export const ComposerDropTarget = 'composer-drop-target'
export const ComposerAttachmentPrefix = 'composer-attachment:'
export const ComposerAttachmentRemovePrefix = 'composer-attachment-remove:'
export const ComposerAttachmentPreviewOverlay = 'composer-attachment-preview-overlay'
export const AddContext = 'add-context'
export const Dictate = 'dictate'
export const CreatePullRequest = 'create-pull-request'
export const Send = 'send'
export const Back = 'back'
export const Model = 'model'
export const ModelPickerToggle = 'model-picker-toggle'
export const ModelPickerSearch = 'model-picker-search'
export const ModelPickerList = 'model-picker-list'
export const AgentModePickerToggle = 'agent-mode-picker-toggle'
export const AgentModePickerItemPrefix = 'agent-mode-picker-item:'
export const ReasoningEffortPickerToggle = 'reasoning-effort-picker-toggle'
export const ReasoningEffortPickerItemPrefix = 'reasoning-effort-picker-item:'
export const RunMode = 'runMode'
export const RunModePickerToggle = 'run-mode-picker-toggle'
export const RunModePickerItemPrefix = 'run-mode-picker-item:'
export const ToggleChatFocus = 'toggle-chat-focus'
export const ToggleSearch = 'toggle-search'
export const ChatList = 'chat-list'
export const CreateProject = 'create-project'
export const CreateSession = 'create-session'
export const CreateSessionInProjectPrefix = 'create-session-in-project:'
export const SessionDebug = 'session-debug'
export const Settings = 'settings'
export const Login = 'login'
export const Logout = 'logout'
export const CloseChat = 'close-chat'
export const SessionDelete = 'SessionDelete'
export const ProjectPrefix = 'project:'
export const SessionPrefix = 'session:'
export const RenamePrefix = 'session-rename:'
export const ModelPickerItemPrefix = 'model-picker-item:'

export const getProjectInputName = (projectId: string): `${typeof ProjectPrefix}${string}` => {
  return `${ProjectPrefix}${projectId}`
}

export const getCreateSessionInProjectInputName = (projectId: string): `${typeof CreateSessionInProjectPrefix}${string}` => {
  return `${CreateSessionInProjectPrefix}${projectId}`
}

export const isCreateSessionInProjectInputName = (name: string): name is `${typeof CreateSessionInProjectPrefix}${string}` => {
  return name.startsWith(CreateSessionInProjectPrefix)
}

export const getProjectIdFromCreateSessionInProjectInputName = (name: `${typeof CreateSessionInProjectPrefix}${string}`): string => {
  return name.slice(CreateSessionInProjectPrefix.length)
}

export const isProjectInputName = (name: string): name is `${typeof ProjectPrefix}${string}` => {
  return name.startsWith(ProjectPrefix)
}

export const getProjectIdFromInputName = (name: `${typeof ProjectPrefix}${string}`): string => {
  return name.slice(ProjectPrefix.length)
}

export const getSessionInputName = (sessionId: string): `${typeof SessionPrefix}${string}` => {
  return `${SessionPrefix}${sessionId}`
}

export const isSessionInputName = (name: string): name is `${typeof SessionPrefix}${string}` => {
  return name.startsWith(SessionPrefix)
}

export const getSessionIdFromInputName = (name: `${typeof SessionPrefix}${string}`): string => {
  return name.slice(SessionPrefix.length)
}

export const getRenameInputName = (sessionId: string): `${typeof RenamePrefix}${string}` => {
  return `${RenamePrefix}${sessionId}`
}

export const isRenameInputName = (name: string): name is `${typeof RenamePrefix}${string}` => {
  return name.startsWith(RenamePrefix)
}

export const getRenameIdFromInputName = (name: `${typeof RenamePrefix}${string}`): string => {
  return name.slice(RenamePrefix.length)
}

export const getModelPickerItemInputName = (modelId: string): `${typeof ModelPickerItemPrefix}${string}` => {
  return `${ModelPickerItemPrefix}${modelId}`
}

export const getComposerAttachmentInputName = (attachmentId: string): `${typeof ComposerAttachmentPrefix}${string}` => {
  return `${ComposerAttachmentPrefix}${attachmentId}`
}

export const isComposerAttachmentInputName = (name: string): name is `${typeof ComposerAttachmentPrefix}${string}` => {
  return name.startsWith(ComposerAttachmentPrefix)
}

export const getAttachmentIdFromComposerAttachmentInputName = (name: `${typeof ComposerAttachmentPrefix}${string}`): string => {
  return name.slice(ComposerAttachmentPrefix.length)
}

export const getComposerAttachmentRemoveInputName = (attachmentId: string): `${typeof ComposerAttachmentRemovePrefix}${string}` => {
  return `${ComposerAttachmentRemovePrefix}${attachmentId}`
}

export const isComposerAttachmentRemoveInputName = (name: string): name is `${typeof ComposerAttachmentRemovePrefix}${string}` => {
  return name.startsWith(ComposerAttachmentRemovePrefix)
}

export const getAttachmentIdFromComposerAttachmentRemoveInputName = (name: `${typeof ComposerAttachmentRemovePrefix}${string}`): string => {
  return name.slice(ComposerAttachmentRemovePrefix.length)
}

export const isComposerAttachmentPreviewOverlayInputName = (name: string): boolean => {
  return name === ComposerAttachmentPreviewOverlay
}

export const isModelPickerItemInputName = (name: string): name is `${typeof ModelPickerItemPrefix}${string}` => {
  return name.startsWith(ModelPickerItemPrefix)
}

export const getModelIdFromModelPickerItemInputName = (name: `${typeof ModelPickerItemPrefix}${string}`): string => {
  return name.slice(ModelPickerItemPrefix.length)
}

export const getAgentModePickerItemInputName = (agentMode: AgentModeType): `${typeof AgentModePickerItemPrefix}${AgentModeType}` => {
  return `${AgentModePickerItemPrefix}${agentMode}`
}

export const isAgentModePickerItemInputName = (name: string): name is `${typeof AgentModePickerItemPrefix}${AgentModeType}` => {
  return name.startsWith(AgentModePickerItemPrefix)
}

export const getAgentModeFromAgentModePickerItemInputName = (name: `${typeof AgentModePickerItemPrefix}${AgentModeType}`): AgentModeType => {
  return name.slice(AgentModePickerItemPrefix.length) as AgentModeType
}

export const getRunModePickerItemInputName = (runMode: RunModeType): `${typeof RunModePickerItemPrefix}${RunModeType}` => {
  return `${RunModePickerItemPrefix}${runMode}`
}

export const isRunModePickerItemInputName = (name: string): name is `${typeof RunModePickerItemPrefix}${RunModeType}` => {
  return name.startsWith(RunModePickerItemPrefix)
}

export const getRunModeFromRunModePickerItemInputName = (name: `${typeof RunModePickerItemPrefix}${RunModeType}`): RunModeType => {
  return name.slice(RunModePickerItemPrefix.length) as RunModeType
}

export const getReasoningEffortPickerItemInputName = (
  reasoningEffort: ReasoningEffortType,
): `${typeof ReasoningEffortPickerItemPrefix}${ReasoningEffortType}` => {
  return `${ReasoningEffortPickerItemPrefix}${reasoningEffort}`
}

export const isReasoningEffortPickerItemInputName = (name: string): name is `${typeof ReasoningEffortPickerItemPrefix}${ReasoningEffortType}` => {
  return name.startsWith(ReasoningEffortPickerItemPrefix)
}

export const getReasoningEffortFromReasoningEffortPickerItemInputName = (
  name: `${typeof ReasoningEffortPickerItemPrefix}${ReasoningEffortType}`,
): ReasoningEffortType => {
  return name.slice(ReasoningEffortPickerItemPrefix.length) as ReasoningEffortType
}

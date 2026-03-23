// cspell:ignore openrouter
import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../src/parts/ChatStrings/ChatStrings.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatViewDom from '../src/parts/GetChatViewDom/GetChatViewDom.ts'
import { parseAndStoreMessagesContent } from '../src/parts/ParsedMessageContent/ParsedMessageContent.ts'

const models = [
  { id: 'test', name: 'test', usageCost: 0 },
  { id: 'codex-5.3', name: 'Codex 5.3', usageCost: 1 },
] as const

const createOptions = (overrides: Partial<GetChatViewDom.GetChatVirtualDomOptions> = {}): GetChatViewDom.GetChatVirtualDomOptions => ({
  addContextButtonEnabled: false,
  authEnabled: false,
  authErrorMessage: '',
  authStatus: 'signed-out',
  chatListScrollTop: 0,
  composerDropActive: false,
  composerDropEnabled: true,
  composerFontFamily: 'system-ui',
  composerFontSize: 13,
  composerHeight: 28,
  composerLineHeight: 20,
  composerValue: '',
  messagesScrollTop: 0,
  models,
  openApiApiKeyInput: '',
  openApiApiKeyState: 'idle',
  openRouterApiKeyInput: '',
  openRouterApiKeyState: 'idle',
  runMode: 'local',
  selectedModelId: 'test',
  selectedProjectId: '',
  selectedSessionId: '',
  sessions: [],
  showRunMode: false,
  todoListToolEnabled: false,
  tokensMax: 0,
  tokensUsed: 0,
  usageOverviewEnabled: false,
  viewMode: 'list',
  voiceDictationEnabled: false,
  ...overrides,
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const renderChatView = (overrides: Partial<GetChatViewDom.GetChatVirtualDomOptions> = {}) => {
  return GetChatViewDom.getChatVirtualDom(createOptions(overrides))
}

test('getChatVirtualDOm should render root chat container', () => {
  const result = renderChatView()
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toMatchObject({
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
})

test('getChatVirtualDOm should structure chat sections as header and list in list mode', () => {
  const result = renderChatView()
  expect(result[0]).toMatchObject({
    childCount: 3,
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toMatchObject({
    childCount: 2,
    className: ClassNames.ChatHeader,
    onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
    type: VirtualDomElements.Div,
  })
  const chatListEmpty = result.find((node) => node.className === ClassNames.ChatListEmpty)
  const chatWelcomeMessage = result.find((node) => node.className === ClassNames.ChatWelcomeMessage)
  expect(chatListEmpty).toMatchObject({
    childCount: 1,
    className: ClassNames.ChatListEmpty,
    type: VirtualDomElements.Div,
  })
  expect(chatWelcomeMessage).toBeUndefined()
  const emptyStateMessage = result.find((node) => node.text === 'Click the + button to open a new chat.')
  expect(emptyStateMessage).toBeDefined()
  const composer = result.find((node) => node.name === 'composer')
  const modelSelect = result.find((node) => node.name === 'model')
  const modelPickerToggle = result.find((node) => node.name === 'model-picker-toggle')
  const sendButton = result.find((node) => node.name === 'send')
  expect(composer).toBeDefined()
  expect(modelSelect).toBeUndefined()
  expect(modelPickerToggle).toMatchObject({
    className: ClassNames.Select,
    onClick: DomEventListenerFunctions.HandleClickModelPickerToggle,
    type: VirtualDomElements.Button,
  })
  expect(sendButton).toBeDefined()
  expect(sendButton).toMatchObject({
    className: `${ClassNames.IconButton} ${ClassNames.SendButtonDisabled}`,
    disabled: true,
  })
  const detailsNode = result.find((node) => node.className === ClassNames.ChatDetails)
  const composerDropTarget = result.find((node) => node.name === 'composer-drop-target')
  expect(detailsNode).toBeUndefined()
  expect(composerDropTarget).toBeUndefined()
  const projectSidebar = result.find((node) => node.className === ClassNames.ProjectSidebar)
  const addProjectButton = result.find((node) => node.name === 'create-project')
  expect(projectSidebar).toBeUndefined()
  expect(addProjectButton).toBeUndefined()
  const chatFocusButton = result.find((node) => node.title === 'Switch to chat focus mode')
  expect(chatFocusButton).toBeDefined()
})

test('getChatVirtualDOm should render model picker toggle button instead of select', () => {
  const result = renderChatView()
  const modelSelect = result.find((node) => node.name === 'model')
  const modelPickerToggle = result.find((node) => node.name === 'model-picker-toggle')
  const modelPicker = result.find((node) => node.className === ClassNames.ChatModelPicker)
  expect(modelSelect).toBeUndefined()
  expect(modelPickerToggle).toMatchObject({
    className: ClassNames.Select,
    onClick: DomEventListenerFunctions.HandleClickModelPickerToggle,
    type: VirtualDomElements.Button,
  })
  const modelPickerToggleLabel = result.find((node) => node.type === VirtualDomElements.Span && node.className === ClassNames.SelectLabel)
  expect(modelPickerToggleLabel).toBeDefined()
  expect(modelPicker).toBeUndefined()
})

test('getChatVirtualDOm should render open model picker with search input and settings button', () => {
  const result = renderChatView({
    modelPickerOpen: true,
    viewMode: 'detail',
  })
  const modelPicker = result.find((node) => node.className === ClassNames.ChatModelPicker)
  const modelPickerSearchInput = result.find((node) => node.name === 'model-picker-search')
  const modelPickerSettingsButton = result.find((node) => node.name === 'model-picker-settings')
  expect(modelPicker).toBeDefined()
  expect(modelPickerSearchInput).toMatchObject({
    inputType: 'search',
    onInput: DomEventListenerFunctions.HandleInput,
    placeholder: 'Search models',
    type: VirtualDomElements.Input,
  })
  expect(modelPickerSettingsButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDom should render open new model picker as absolute chat child and update chat childCount', () => {
  const result = renderChatView({
    modelPickerOpen: true,
    viewMode: 'detail',
  })
  expect(result[0]).toMatchObject({
    childCount: 4,
  })
  const pickerContainers = result.filter((node) => node.className === ClassNames.ChatModelPickerContainer)
  expect(pickerContainers).toHaveLength(1)
  const sendAreaIndex = result.findIndex((node) => node.className === ClassNames.ChatSendArea)
  expect(sendAreaIndex).toBeGreaterThan(-1)
})

test('getChatVirtualDom should not render absolute picker chat child when picker is not open', () => {
  const result = renderChatView({
    modelPickerOpen: false,
    viewMode: 'detail',
  })
  expect(result[0]).toMatchObject({
    childCount: 3,
  })
  const absolutePickerContainer = result.find((node) => node.className === ClassNames.ChatModelPickerContainer && node.style === 'position:absolute;')
  expect(absolutePickerContainer).toBeUndefined()
})

test('getChatVirtualDOm should filter model picker entries by search', () => {
  const result = renderChatView({
    modelPickerOpen: true,
    modelPickerSearchValue: 'codex',
    models,
    selectedModelId: 'codex-5.3',
    viewMode: 'detail',
  })
  const modelPickerItems = result.filter((node) => node.name?.startsWith('model-picker-item:'))
  const modelPickerList = result.find((node) => node.name === 'model-picker-list')
  const codexLabel = result.find((node) => node.text === 'Codex 5.3')
  const testLabel = result.find((node) => node.text === 'test')
  expect(modelPickerItems).toHaveLength(0)
  expect(modelPickerList).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Ul,
  })
  expect(codexLabel).toBeDefined()
  expect(testLabel).toBeUndefined()
})

test('getChatVirtualDom should render model picker usage cost text with subdued class', () => {
  const result = renderChatView({
    modelPickerOpen: true,
    models,
    selectedModelId: 'test',
    viewMode: 'detail',
  })
  const usageCostNode = result.find((node) => node.className === ClassNames.ChatModelPickerItemUsageCost)
  const freeUsageText = result.find((node) => node.text === '0x')
  expect(usageCostNode).toMatchObject({
    className: ClassNames.ChatModelPickerItemUsageCost,
    type: VirtualDomElements.Span,
  })
  expect(freeUsageText).toBeDefined()
})

test('getChatVirtualDOm should show model picker empty-state message when search has no results', () => {
  const result = renderChatView({
    modelPickerOpen: true,
    modelPickerSearchValue: 'not-found-query',
    models,
    selectedModelId: 'codex-5.3',
    viewMode: 'detail',
  })
  const modelPickerItems = result.filter((node) => node.className?.startsWith(ClassNames.ChatModelPickerItem))
  const emptyStateLabel = result.find((node) => node.text === 'No matching models have been found.')
  expect(modelPickerItems).toHaveLength(1)
  expect(emptyStateLabel).toBeDefined()
})

test('getChatVirtualDOm should render projects and chats in chat-focus mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const projects = [{ id: 'project-1', name: '_blank', uri: '' }]
  const result = renderChatView({
    projectExpandedIds: ['project-1'],
    projects,
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'chat-focus',
  })

  expect(result[0]).toMatchObject({
    childCount: 3,
    className: `${ClassNames.Viewlet} Chat ChatFocus`,
  })
  const chatHeader = result.find((node) => node.className === ClassNames.ChatHeader)
  const projectSidebar = result.find((node) => node.className === ClassNames.ProjectSidebar)
  const addProjectButton = result.find((node) => node.name === 'create-project')
  const projectList = result.find((node) => node.className === ClassNames.ProjectList)
  const chatList = result.find((node) => node.className === ClassNames.ChatList)
  const composer = result.find((node) => node.name === 'composer')
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  const addSessionInProjectButton = result.find((node) => node.name === 'create-session-in-project:project-1')
  const normalModeButton = result.find((node) => node.title === 'Switch to normal chat mode')
  const backToChatListButton = result.find((node) => node.name === 'back' && node.title === 'Back to chat list')
  const welcomeMessage = result.find((node) => node.className === ClassNames.ChatWelcomeMessage)
  expect(projectSidebar).toMatchObject({
    childCount: 3,
  })
  expect(chatHeader).toBeUndefined()
  expect(projectList).toBeDefined()
  expect(addProjectButton).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleProjectAddButtonContextMenu,
  })
  expect(chatList).toBeUndefined()
  expect(composer).toBeDefined()
  expect(sessionButton).toBeDefined()
  expect(addSessionInProjectButton).toBeDefined()
  expect(backToChatListButton).toMatchObject({
    className: `${ClassNames.Button} ${ClassNames.ButtonSecondary}`,
    name: 'back',
    onClick: DomEventListenerFunctions.HandleClickBack,
    title: 'Back to chat list',
    type: VirtualDomElements.Button,
  })
  expect(result.indexOf(projectList as (typeof result)[number])).toBeLessThan(result.indexOf(addProjectButton as (typeof result)[number]))
  expect(result.indexOf(addProjectButton as (typeof result)[number])).toBeLessThan(result.indexOf(backToChatListButton as (typeof result)[number]))
  expect(normalModeButton).toBeUndefined()
  expect(welcomeMessage).toBeUndefined()
})

test('getChatVirtualDOm should render session list entries', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
  })
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  const deleteButton = result.find((node) => node.name === 'SessionDelete' && node['data-id'] === 'session-1')
  const sessionLabel = result.find((node) => node.name === 'session:session-1' && node.className === ClassNames.ChatListItemLabel)
  const sessionStatusRow = result.find((node) => node.className === ClassNames.ChatListItemStatusRow)
  const sessionStatusIcon = result.find((node) => node.className?.includes(`${ClassNames.ChatListItemStatusIcon} codicon codicon-circle-filled`))
  expect(sessionButton).toBeDefined()
  expect(deleteButton).toBeDefined()
  expect(sessionLabel).toBeDefined()
  expect(sessionStatusRow).toBeDefined()
  expect(sessionStatusIcon).toBeDefined()
  const chatList = result.find((node) => node.className === ClassNames.ChatList)
  expect(chatList).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
    type: VirtualDomElements.Ul,
  })
  expect(deleteButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClickDelete,
  })
})

test('getChatVirtualDOm should render stopped/in progress/finished session status icons', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    {
      id: 'session-2',
      messages: [{ id: 'm-1', inProgress: true, role: 'assistant' as const, text: '', time: '10:00' }],
      title: 'Chat 2',
    },
    {
      id: 'session-3',
      messages: [{ id: 'm-2', role: 'assistant' as const, text: 'done', time: '10:01' }],
      title: 'Chat 3',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
  })
  const statusIcons = result.filter((node) => node.className?.includes(ClassNames.ChatListItemStatusIcon))
  expect(statusIcons).toHaveLength(3)
  expect(statusIcons.some((node) => node.className?.includes(ClassNames.ChatListItemStatusStopped))).toBe(true)
  expect(statusIcons.some((node) => node.className?.includes(ClassNames.ChatListItemStatusInProgress))).toBe(true)
  expect(statusIcons.some((node) => node.className?.includes(ClassNames.ChatListItemStatusFinished))).toBe(true)
})

test('getChatVirtualDOm should restore chat list scroll position', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = renderChatView({
    chatListScrollTop: 90,
    selectedSessionId: 'session-1',
    sessions,
  })
  const chatList = result.find((node) => node.className === ClassNames.ChatList)
  expect(chatList).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
    onScroll: DomEventListenerFunctions.HandleChatListScroll,
    scrollTop: 90,
    type: VirtualDomElements.Ul,
  })
})

test('getChatVirtualDOm should render composer textarea', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    composerValue: 'hello',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const composer = result.find((node) => node.name === 'composer')
  const sendButton = result.find((node) => node.name === 'send')
  const composeForm = result.find((node) => node.className === ClassNames.ChatSendArea)
  expect(composer).toBeDefined()
  expect(sendButton).toBeDefined()
  expect(composeForm).toBeDefined()
  expect(composer).toMatchObject({
    className: 'MultilineInputBox ChatInputBox',
    onContextMenu: DomEventListenerFunctions.HandleChatInputContextMenu,
    onInput: DomEventListenerFunctions.HandleInput,
    type: VirtualDomElements.TextArea,
  })
  expect(composeForm).toMatchObject({
    className: ClassNames.ChatSendArea,
    onSubmit: DomEventListenerFunctions.HandleSubmit,
    type: VirtualDomElements.Form,
  })
  expect(sendButton).toMatchObject({
    buttonType: 'submit',
    className: ClassNames.IconButton,
    disabled: false,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should render dictate button before send button when enabled', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    composerValue: 'hello',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
    voiceDictationEnabled: true,
  })
  const dictateButtonIndex = result.findIndex((node) => node.name === 'dictate')
  const sendButtonIndex = result.findIndex((node) => node.name === 'send')
  expect(dictateButtonIndex).toBeGreaterThan(-1)
  expect(sendButtonIndex).toBeGreaterThan(dictateButtonIndex)
})

test('getChatVirtualDOm should render todo list above composer when enabled and not empty', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-1',
          role: 'assistant' as const,
          text: '',
          time: '',
          toolCalls: [
            {
              arguments: JSON.stringify({
                todos: [
                  { status: 'todo', text: 'Run baseline tests' },
                  { status: 'inProgress', text: 'Implement feature' },
                  { status: 'completed', text: 'Review and summary' },
                ],
              }),
              name: 'todo_list',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    todoListToolEnabled: true,
    viewMode: 'detail',
  })
  const todoList = result.find((node) => node.className === ClassNames.ChatTodoList)
  const todoItems = result.filter((node) => node.className?.startsWith(`${ClassNames.ChatTodoListItem} `))
  const headerText = result.find((node) => node.text === 'Todos (1/3)')
  const composer = result.find((node) => node.name === 'composer')
  const todoListIndex = result.findIndex((node) => node.className === ClassNames.ChatTodoList)
  const composerIndex = result.findIndex((node) => node.name === 'composer')
  expect(todoList).toBeDefined()
  expect(todoItems).toHaveLength(3)
  expect(headerText).toBeDefined()
  expect(composer).toBeDefined()
  expect(todoListIndex).toBeGreaterThan(-1)
  expect(composerIndex).toBeGreaterThan(todoListIndex)
  expect(todoItems.some((node) => node.className?.includes(' todo'))).toBe(true)
  expect(todoItems.some((node) => node.className?.includes(' inProgress'))).toBe(true)
  expect(todoItems.some((node) => node.className?.includes(' completed'))).toBe(true)
})

test('getChatVirtualDOm should not render todo list when disabled', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'message-1',
          role: 'assistant' as const,
          text: '',
          time: '',
          toolCalls: [
            {
              arguments: JSON.stringify({
                todos: [{ status: 'todo', text: 'Task 1' }],
              }),
              name: 'todo_list',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    todoListToolEnabled: false,
    viewMode: 'detail',
  })
  const todoList = result.find((node) => node.className === ClassNames.ChatTodoList)
  expect(todoList).toBeUndefined()
})

test('getChatVirtualDOm should render drag overlay message in composer drop target', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    composerDropActive: true,
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const composerDropTarget = result.find((node) => node.name === 'composer-drop-target')
  const overlayMessage = result.find((node) => node.text === 'Attach Image as Context')
  expect(composerDropTarget).toBeDefined()
  expect(composerDropTarget).toMatchObject({
    className: `${ClassNames.ChatViewDropOverlay} ${ClassNames.ChatViewDropOverlayActive}`,
  })
  expect(overlayMessage).toBeDefined()
})

test('getChatVirtualDOm should render message rows for selected session', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'user' as const, text: 'Hi', time: '10:30' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const messageNode = result.find((node) => node.className?.includes(ClassNames.MessageUser))
  expect(messageNode).toBeDefined()
})

test('getChatVirtualDOm should restore messages scroll position', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'user' as const, text: 'Hi', time: '10:30' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    messagesScrollTop: 180,
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const messages = result.find((node) => node.className === 'ChatMessages')
  expect(messages).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
    onScroll: DomEventListenerFunctions.HandleMessagesScroll,
    scrollTop: 180,
  })
})

test('getChatVirtualDOm should render settings button in header actions', () => {
  const result = renderChatView()
  const settingsButton = result.find((node) => node.title === 'Settings')
  expect(settingsButton).toBeDefined()
  expect(settingsButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickSettings,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should render new chat button in header actions', () => {
  const result = renderChatView()
  const newChatButton = result.find((node) => node.title === 'New Chat')
  expect(newChatButton).toBeDefined()
  expect(newChatButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickNew,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should render debug button in header actions', () => {
  const result = renderChatView()
  const debugButton = result.find((node) => node.title === 'Debug')
  expect(debugButton).toBeDefined()
  expect(debugButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickSessionDebug,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should render close button in header actions', () => {
  const result = renderChatView()
  const closeButton = result.find((node) => node.title === 'Close Chat')
  expect(closeButton).toBeDefined()
  expect(closeButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickClose,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should render search button in header actions when search is enabled', () => {
  const result = renderChatView({
    searchEnabled: true,
  })
  const searchButton = result.find((node) => node.name === 'toggle-search')
  expect(searchButton).toBeDefined()
  expect(searchButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should render search input below header when search field is visible', () => {
  const result = renderChatView({
    searchEnabled: true,
    searchFieldVisible: true,
    searchValue: 'dummy',
  })
  const searchFieldContainer = result.find((node) => node.className === ClassNames.SearchFieldContainer)
  const searchInput = result.find((node) => node.name === 'search')
  expect(searchFieldContainer).toBeDefined()
  expect(searchInput).toMatchObject({
    inputType: 'search',
    onInput: DomEventListenerFunctions.HandleSearchInput,
    type: VirtualDomElements.Input,
    value: 'dummy',
  })
})

test('getChatVirtualDOm should filter chat list by search value when search enabled', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'alpha' },
    { id: 'session-2', messages: [], title: 'beta' },
    { id: 'session-3', messages: [], title: 'alphabet' },
  ]
  const result = renderChatView({
    searchEnabled: true,
    searchFieldVisible: true,
    searchValue: 'alpha',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'list',
  })
  const filteredSessionItems = result.filter((node) => node.className === ClassNames.ChatListItem)
  expect(filteredSessionItems).toHaveLength(2)
  const alphaLabel = result.find((node) => node.text === 'alpha')
  const alphabetLabel = result.find((node) => node.text === 'alphabet')
  const betaLabel = result.find((node) => node.text === 'beta')
  expect(alphaLabel).toBeDefined()
  expect(alphabetLabel).toBeDefined()
  expect(betaLabel).toBeUndefined()
})

test('getChatVirtualDOm should render focused chat list item highlight', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = renderChatView({
    listFocusedIndex: 1,
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'list',
  })
  const focusedItems = result.filter((node) => node.className === `${ClassNames.ChatListItem} ${ClassNames.ChatListItemFocused}`)
  expect(focusedItems).toHaveLength(1)
})

test('getChatVirtualDOm should render login button in header actions when auth is enabled and signed out', () => {
  const result = renderChatView({
    authEnabled: true,
    authStatus: 'signed-out',
  })
  const loginButton = result.find((node) => node.title === 'Login to backend')
  expect(loginButton).toBeDefined()
  expect(loginButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should disable login button while signing in', () => {
  const result = renderChatView({
    authEnabled: true,
    authStatus: 'signing-in',
  })
  const loginButton = result.find((node) => node.name === 'login')
  expect(loginButton).toBeDefined()
  expect(loginButton).toMatchObject({
    disabled: true,
    title: 'Logging in to backend',
  })
})

test('getChatVirtualDOm should render auth error label when login fails', () => {
  const result = renderChatView({
    authEnabled: true,
    authErrorMessage: 'Invalid backend credentials.',
    authStatus: 'signed-out',
  })
  const authError = result.find((node) => node.className === 'ChatAuthError')
  expect(authError).toBeDefined()
  const authErrorText = result.find((node) => node.text === 'Invalid backend credentials.')
  expect(authErrorText).toBeDefined()
})

test('getChatVirtualDOm should hide session list in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  expect(sessionButton).toBeUndefined()
})

test('getChatVirtualDOm should render selected session messages in detail mode', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        { id: 'm1', role: 'user' as const, text: 'hello', time: '10:30' },
        { id: 'm2', role: 'assistant' as const, text: 'hi', time: '10:31' },
      ],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const userMessageNode = result.find((node) => node.className?.includes(ClassNames.MessageUser))
  const assistantMessageNode = result.find((node) => node.className?.includes(ClassNames.MessageAssistant))
  const messageNodes = result.filter((node) => node.className?.split(' ').includes(ClassNames.Message))
  expect(userMessageNode).toBeDefined()
  expect(assistantMessageNode).toBeDefined()
  expect(messageNodes).toHaveLength(2)
})

test('getChatVirtualDOm should render assistant tool call lines', () => {
  const uri = 'file:///workspace/index.html'
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: '',
          time: '10:31',
          toolCalls: [
            {
              arguments: `{"uri":"${uri}"}`,
              id: 'call_1',
              name: 'read_file',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const toolCallDomStart = result.findIndex((node) => node.className === ClassNames.ChatOrderedList)
  expect(toolCallDomStart).toBeGreaterThan(-1)
  expect(result.slice(toolCallDomStart, toolCallDomStart + 7)).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: uri,
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      className: ClassNames.FileIcon,
    }),
    expect.objectContaining({
      text: 'read_file ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': uri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': uri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'index.html',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getChatVirtualDOm should render assistant read_file path as clickable filename', () => {
  const path = 'src/index.html'
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: '',
          time: '10:31',
          toolCalls: [
            {
              arguments: `{"path":"${path}"}`,
              id: 'call_1',
              name: 'read_file',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const fileNameLinkNode = result.find(
    (node) => node.type === VirtualDomElements.Span && node.className === ClassNames.ChatToolCallReadFileLink && node['data-uri'] === path,
  )
  expect(fileNameLinkNode).toBeDefined()
  const toolCallDomStart = result.findIndex((node) => node.className === ClassNames.ChatOrderedList)
  expect(toolCallDomStart).toBeGreaterThan(-1)
  expect(result.slice(toolCallDomStart, toolCallDomStart + 7)).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: path,
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      className: ClassNames.FileIcon,
    }),
    expect.objectContaining({
      text: 'read_file ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': path,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': path,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'index.html',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getChatVirtualDOm should render assistant list_files uri as clickable filename', () => {
  const uri = 'file:///workspace/src'
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: '',
          time: '10:31',
          toolCalls: [
            {
              arguments: `{"uri":"${uri}"}`,
              id: 'call_1',
              name: 'list_files',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const toolCallDomStart = result.findIndex((node) => node.className === ClassNames.ChatOrderedList)
  expect(toolCallDomStart).toBeGreaterThan(-1)
  expect(result.slice(toolCallDomStart, toolCallDomStart + 7)).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: uri,
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      className: ClassNames.FileIcon,
    }),
    expect.objectContaining({
      text: 'list_files ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': uri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': uri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'src',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getChatVirtualDOm should render assistant list_file uri as clickable filename', () => {
  const uri = 'file:///workspace/package.json'
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: '',
          time: '10:31',
          toolCalls: [
            {
              arguments: `{"uri":"${uri}"}`,
              id: 'call_1',
              name: 'list_file',
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const toolCallDomStart = result.findIndex((node) => node.className === ClassNames.ChatOrderedList)
  expect(toolCallDomStart).toBeGreaterThan(-1)
  expect(result.slice(toolCallDomStart, toolCallDomStart + 7)).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    {
      childCount: 3,
      className: ClassNames.ChatOrderedListItem,
      title: uri,
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      className: ClassNames.FileIcon,
    }),
    expect.objectContaining({
      text: 'list_file ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': uri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': uri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'package.json',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getChatVirtualDOm should render read_file not-found status', () => {
  const path = 'src/missing.html'
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: '',
          time: '10:31',
          toolCalls: [
            {
              arguments: `{"path":"${path}"}`,
              id: 'call_1',
              name: 'read_file',
              status: 'not-found' as const,
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const statusNode = result.find((node) => node.text === ' (not-found)')
  expect(statusNode).toBeDefined()
})

test('getChatVirtualDOm should render read_file error status with short message', () => {
  const path = 'src/index.html'
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: '',
          time: '10:31',
          toolCalls: [
            {
              arguments: `{"path":"${path}"}`,
              errorMessage: 'permission denied',
              id: 'call_1',
              name: 'read_file',
              status: 'error' as const,
            },
          ],
        },
      ],
      title: 'Chat 1',
    },
  ]

  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const statusNode = result.find((node) => node.text === ' (error: permission denied)')
  expect(statusNode).toBeDefined()
})

test('getChatVirtualDOm should render OpenRouter api key input and save button for missing key message', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openRouterApiKeyRequiredMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    openRouterApiKeyInput: 'or-key-typed',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const apiKeyInput = result.find((node) => node.name === 'open-router-api-key')
  const apiKeyInputIndex = result.findIndex((node) => node.name === 'open-router-api-key')
  const apiKeyForm = result[apiKeyInputIndex - 1]
  const saveButton = result.find((node) => node.name === 'save-openrouter-api-key')
  const openRouterButton = result.find((node) => node.name === 'open-openrouter-api-key-settings')
  expect(apiKeyForm).toMatchObject({
    className: ClassNames.MissingApiKeyForm,
    method: 'GET',
    onSubmit: DomEventListenerFunctions.HandleMissingOpenRouterApiKeyFormSubmit,
    type: VirtualDomElements.Form,
  })
  expect(apiKeyInput).toMatchObject({
    autocapitalize: 'off',
    autocomplete: 'off',
    autocorrect: 'off',
    onInput: DomEventListenerFunctions.HandleInput,
    spellcheck: false,
    type: VirtualDomElements.Input,
  })
  expect(saveButton).toMatchObject({
    inputType: 'submit',
    type: VirtualDomElements.Button,
  })
  expect(openRouterButton).toMatchObject({
    href: 'https://openrouter.ai/settings/keys',
    rel: 'noopener noreferrer',
    target: '_blank',
    type: VirtualDomElements.A,
  })
})

test('getChatVirtualDOm should render disabled OpenRouter save button with Saving text while api key is saving', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openRouterApiKeyRequiredMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    openRouterApiKeyInput: 'or-key-typed',
    openRouterApiKeyState: 'saving',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const saveButton = result.find((node) => node.name === 'save-openrouter-api-key')
  const savingText = result.find((node) => node.text === 'Saving...')
  expect(saveButton).toMatchObject({
    disabled: true,
    inputType: 'submit',
    type: VirtualDomElements.Button,
  })
  expect(savingText).toBeDefined()
})

test('getChatVirtualDOm should render OpenAPI api key input and save button for missing key message', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openApiApiKeyRequiredMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    openApiApiKeyInput: 'oa-key-typed',
    openRouterApiKeyInput: 'or-key-typed',
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const apiKeyInput = result.find((node) => node.name === 'open-api-api-key')
  const apiKeyInputIndex = result.findIndex((node) => node.name === 'open-api-api-key')
  const apiKeyForm = result[apiKeyInputIndex - 1]
  const saveButton = result.find((node) => node.name === 'save-openapi-api-key')
  const openApiButton = result.find((node) => node.name === 'open-openapi-api-key-website')
  expect(apiKeyForm).toMatchObject({
    className: ClassNames.MissingApiKeyForm,
    method: 'GET',
    onSubmit: DomEventListenerFunctions.HandleMissingOpenAiApiKeyFormSubmit,
    type: VirtualDomElements.Form,
  })
  expect(apiKeyInput).toMatchObject({
    autocapitalize: 'off',
    autocomplete: 'off',
    autocorrect: 'off',
    onInput: DomEventListenerFunctions.HandleInput,
    pattern: '^sk-.+',
    required: true,
    spellcheck: false,
    type: VirtualDomElements.Input,
  })
  expect(saveButton).toMatchObject({
    inputType: 'submit',
    type: VirtualDomElements.Button,
  })
  expect(openApiButton).toMatchObject({
    href: 'https://platform.openai.com/api-keys',
    rel: 'noopener noreferrer',
    target: '_blank',
    type: VirtualDomElements.A,
  })
})

test('getChatVirtualDOm should render OpenRouter request failure reasons as ordered list', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openRouterRequestFailedMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const orderedList = result.find((node) => node.type === VirtualDomElements.Ol)
  const listItems = result.filter((node) => node.type === VirtualDomElements.Li)
  const cspReason = result.find((node) => node.text === 'ContentSecurityPolicyViolation: Check DevTools for details.')
  const serverReason = result.find((node) => node.text === 'OpenRouter server offline: Check DevTools for details.')
  const internetReason = result.find((node) => node.text === 'Check your internet connection.')
  expect(orderedList).toBeDefined()
  expect(listItems).toHaveLength(3)
  expect(cspReason).toBeDefined()
  expect(serverReason).toBeDefined()
  expect(internetReason).toBeDefined()
})

test('getChatVirtualDOm should render OpenRouter too many requests reasons as ordered list', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: `${openRouterTooManyRequestsMessage} Limit resets: daily.`, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const orderedList = result.find((node) => node.type === VirtualDomElements.Ol)
  const listItems = result.filter((node) => node.type === VirtualDomElements.Li)
  const waitReason = result.find((node) => node.text === 'Wait a short time and retry your request.')
  const frequencyReason = result.find((node) => node.text === 'Reduce request frequency to avoid rate limits.')
  const modelReason = result.find((node) => node.text === 'Use a different model if this one is saturated.')
  expect(orderedList).toBeDefined()
  expect(listItems).toHaveLength(3)
  expect(waitReason).toBeDefined()
  expect(frequencyReason).toBeDefined()
  expect(modelReason).toBeDefined()
})

test('getChatVirtualDOm should render ordered list from assistant message text', async () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: [
            'I have access to the following tools:',
            '',
            '1. functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI.',
            '2. functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder.',
            '3. functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder.',
            '',
            'I can also use these tools in parallel when appropriate.',
          ].join('\n'),
          time: '10:31',
        },
      ],
      title: 'Chat 1',
    },
  ]

  const parsedMessages = await parseAndStoreMessagesContent([], sessions[0].messages)

  const result = renderChatView({
    parsedMessages,
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const orderedList = result.find((node) => node.type === VirtualDomElements.Ol)
  const listItems = result.filter((node) => node.type === VirtualDomElements.Li)
  const readFileReason = result.find(
    (node) =>
      node.text ===
      'functions.read_file - Read UTF-8 text content from a file inside the currently open workspace folder. Only pass an absolute URI.',
  )
  const writeFileReason = result.find(
    (node) => node.text === 'functions.write_file - Write UTF-8 text content to a file inside the currently open workspace folder.',
  )
  const listFilesReason = result.find(
    (node) =>
      node.text === 'functions.list_files - List direct children (files and folders) for a folder inside the currently open workspace folder.',
  )
  expect(orderedList).toBeDefined()
  expect(listItems).toHaveLength(3)
  expect(readFileReason).toBeDefined()
  expect(writeFileReason).toBeDefined()
  expect(listFilesReason).toBeDefined()
})

test('getChatVirtualDom should keep send area outside message when assistant markdown has nested blocks', async () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [
        {
          id: 'm1',
          role: 'assistant' as const,
          text: [
            'I can do that, but I need file contents first.',
            '',
            'Two quick questions:',
            '',
            '1. Keep exact duplicates only?',
            '   - Exact is safest.',
            '   - Normalized is more aggressive.',
            '2. Paste the file or upload it.',
            '',
            '# keep name, value and priority (!important)',
            '',
            'How to run:',
            '- Install the dependency',
            '- Run script',
          ].join('\n'),
          time: '10:31',
        },
      ],
      title: 'Chat 1',
    },
  ]
  const parsedMessages = await parseAndStoreMessagesContent([], sessions[0].messages)
  const result = renderChatView({
    parsedMessages,
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })

  const chatMessageContent = result.find((node) => node.className === ClassNames.ChatMessageContent)
  const chatSendAreaIndex = result.findIndex((node) => node.className === ClassNames.ChatSendArea)
  expect(chatMessageContent).toMatchObject({
    childCount: 6,
    className: ClassNames.ChatMessageContent,
    type: VirtualDomElements.Div,
  })
  expect(chatSendAreaIndex).toBeGreaterThan(-1)
})

test('getChatVirtualDOm should render selected chat title in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Project Plan' }]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const backButtonIndex = result.findIndex((node) => node.name === 'back')
  expect(backButtonIndex).toBeGreaterThan(-1)
  const chatHeader = result.find((node) => node.className === ClassNames.ChatHeader)
  expect(chatHeader).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
  })
  const titleNode = result[backButtonIndex + 3]
  expect(titleNode).toMatchObject({ text: 'Project Plan' })
  expect(titleNode).toBeDefined()
})

test('getChatVirtualDOm should render back button in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    viewMode: 'detail',
  })
  const backButton = result.find((node) => node.name === 'back')
  expect(backButton).toBeDefined()
  expect(backButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickBack,
    role: 'button',
    title: 'Back to chats',
    type: VirtualDomElements.Button,
  })
})

test('getChatVirtualDOm should hide back button in list mode', () => {
  const result = renderChatView()
  const backButton = result.find((node) => node.name === 'back')
  expect(backButton).toBeUndefined()
})

test('getChatVirtualDOm should not render token usage overview when disabled', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    tokensMax: 1000,
    tokensUsed: 100,
    viewMode: 'detail',
  })
  const usageRing = result.find((node) => node.className === ClassNames.TokenUsageRing)
  expect(usageRing).toBeUndefined()
})

test('getChatVirtualDOm should render token usage overview when enabled', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = renderChatView({
    selectedSessionId: 'session-1',
    sessions,
    tokensMax: 1000,
    tokensUsed: 100,
    usageOverviewEnabled: true,
    viewMode: 'detail',
  })
  const usageContainer = result.find((node) => node.className === ClassNames.TokenUsageOverview)
  const usageRing = result.find((node) => node.className === ClassNames.TokenUsageRing)
  const usageText = result.find((node) => node.text === '100 / 1000')
  const sendButtonIndex = result.findIndex((node) => node.name === 'send')
  const usageRingIndex = result.findIndex((node) => node.className === ClassNames.TokenUsageRing)
  expect(usageContainer).toBeDefined()
  expect(usageRing).toMatchObject({
    title: '100 of 1000 tokens used (10%)',
    type: VirtualDomElements.Div,
  })
  expect(usageText).toBeDefined()
  expect(usageRingIndex).toBeGreaterThan(-1)
  expect(sendButtonIndex).toBeGreaterThan(usageRingIndex)
})

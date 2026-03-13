// cspell:ignore openrouter
import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../src/parts/chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatViewDom from '../src/parts/GetChatViewDom/GetChatViewDom.ts'

const models = [
  { id: 'test', name: 'test' },
  { id: 'codex-5.3', name: 'Codex 5.3' },
] as const

test('getStatusBarVirtualDom should render root chat container', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toMatchObject({
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should structure chat sections as header and list in list mode', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  expect(result[0]).toMatchObject({
    childCount: 4,
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toMatchObject({
    childCount: 2,
    className: ClassNames.ChatHeader,
    type: VirtualDomElements.Div,
  })
  const chatListEmpty = result.find((node) => node.className === ClassNames.ChatListEmpty)
  expect(chatListEmpty).toMatchObject({
    childCount: 1,
    className: ClassNames.ChatListEmpty,
    type: VirtualDomElements.Div,
  })
  const emptyStateMessage = result.find((node) => node.text === 'Click the + button to open a new chat.')
  expect(emptyStateMessage).toBeDefined()
  const composer = result.find((node) => node.name === 'composer')
  const modelSelect = result.find((node) => node.name === 'model')
  const sendButton = result.find((node) => node.name === 'send')
  expect(composer).toBeDefined()
  expect(modelSelect).toBeDefined()
  expect(modelSelect).toMatchObject({
    className: ClassNames.Select,
    onInput: DomEventListenerFunctions.HandleModelChange,
    type: VirtualDomElements.Select,
    value: 'test',
  })
  expect(sendButton).toBeDefined()
  expect(sendButton).toMatchObject({
    className: `${ClassNames.IconButton} ${ClassNames.SendButtonDisabled}`,
    disabled: true,
  })
  const detailsNode = result.find((node) => node.className === ClassNames.ChatDetails)
  expect(detailsNode).toBeUndefined()
  const projectSidebar = result.find((node) => node.className === ClassNames.ProjectSidebar)
  const addProjectButton = result.find((node) => node.name === 'create-project')
  expect(projectSidebar).toBeUndefined()
  expect(addProjectButton).toBeUndefined()
  const chatFocusButton = result.find((node) => node.title === 'Switch to chat focus mode')
  expect(chatFocusButton).toBeDefined()
})

test('getStatusBarVirtualDom should render projects and chats in chat-focus mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const projects = [{ id: 'project-1', name: '_blank', uri: '' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'chat-focus',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
    false,
    true,
    projects,
    ['project-1'],
    'project-1',
    0,
  )

  expect(result[0]).toMatchObject({
    childCount: 5,
    className: `${ClassNames.Viewlet} Chat ChatFocus`,
  })
  const projectSidebar = result.find((node) => node.className === ClassNames.ProjectSidebar)
  const addProjectButton = result.find((node) => node.name === 'create-project')
  const chatList = result.find((node) => node.className === ClassNames.ChatList)
  const composer = result.find((node) => node.name === 'composer')
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  const addSessionInProjectButton = result.find((node) => node.name === 'create-session-in-project:project-1')
  const normalModeButton = result.find((node) => node.title === 'Switch to normal chat mode')
  expect(projectSidebar).toBeDefined()
  expect(addProjectButton).toBeDefined()
  expect(chatList).toBeUndefined()
  expect(composer).toBeDefined()
  expect(sessionButton).toBeDefined()
  expect(addSessionInProjectButton).toBeDefined()
  expect(normalModeButton).toBeUndefined()
})

test('getStatusBarVirtualDom should render session list entries', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'list',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  const deleteButton = result.find((node) => node.name === 'SessionDelete' && node['data-id'] === 'session-1')
  const sessionLabel = result.find((node) => node.name === 'session:session-1' && node.className === ClassNames.ChatListItemLabel)
  expect(sessionButton).toBeDefined()
  expect(deleteButton).toBeDefined()
  expect(sessionLabel).toBeDefined()
  expect(sessionButton).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
    type: VirtualDomElements.Div,
  })
  expect(deleteButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClickDelete,
  })
})

test('getStatusBarVirtualDom should restore chat list scroll position', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'list',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    90,
    0,
  )
  const chatList = result.find((node) => node.className === ClassNames.ChatList)
  expect(chatList).toMatchObject({
    onScroll: DomEventListenerFunctions.HandleChatListScroll,
    scrollTop: 90,
  })
})

test('getStatusBarVirtualDom should render composer textarea', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    'hello',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const composer = result.find((node) => node.name === 'composer')
  const sendButton = result.find((node) => node.name === 'send')
  const composeForm = result.find((node) => node.className === ClassNames.ChatSendArea)
  expect(composer).toBeDefined()
  expect(sendButton).toBeDefined()
  expect(composeForm).toBeDefined()
  expect(composer).toMatchObject({
    className: ClassNames.MultilineInputBox,
    onInput: DomEventListenerFunctions.HandleInput,
    type: VirtualDomElements.TextArea,
    value: 'hello',
  })
  expect(composeForm).toMatchObject({
    className: ClassNames.ChatSendArea,
    onSubmit: DomEventListenerFunctions.HandleSubmit,
    type: VirtualDomElements.Form,
  })
  expect(sendButton).toMatchObject({
    className: ClassNames.IconButton,
    buttonType: 'submit',
    disabled: false,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render drag overlay message in composer drop target', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
    true,
  )
  const composerDropTarget = result.find((node) => node.name === 'composer-drop-target')
  const overlayMessage = result.find((node) => node.text === 'Attach Image as Context')
  expect(composerDropTarget).toBeDefined()
  expect(composerDropTarget).toMatchObject({
    className: `${ClassNames.ChatViewDropOverlay} ${ClassNames.ChatViewDropOverlayActive}`,
  })
  expect(overlayMessage).toBeDefined()
})

test('getStatusBarVirtualDom should render message rows for selected session', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'user' as const, text: 'Hi', time: '10:30' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const messageNode = result.find((node) => node.className?.includes(ClassNames.MessageUser))
  expect(messageNode).toBeDefined()
})

test('getStatusBarVirtualDom should restore messages scroll position', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'user' as const, text: 'Hi', time: '10:30' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    180,
  )
  const messages = result.find((node) => node.className === 'ChatMessages')
  expect(messages).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
    onScroll: DomEventListenerFunctions.HandleMessagesScroll,
    scrollTop: 180,
  })
})

test('getStatusBarVirtualDom should render settings button in header actions', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  const settingsButton = result.find((node) => node.title === 'Settings')
  expect(settingsButton).toBeDefined()
  expect(settingsButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickSettings,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render new chat button in header actions', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  const newChatButton = result.find((node) => node.title === 'New Chat')
  expect(newChatButton).toBeDefined()
  expect(newChatButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickNew,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render debug button in header actions', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  const debugButton = result.find((node) => node.title === 'Debug')
  expect(debugButton).toBeDefined()
  expect(debugButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickSessionDebug,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render close button in header actions', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  const closeButton = result.find((node) => node.title === 'Close Chat')
  expect(closeButton).toBeDefined()
  expect(closeButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickClose,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should hide session list in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  expect(sessionButton).toBeUndefined()
})

test('getStatusBarVirtualDom should render selected session messages in detail mode', () => {
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
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const userMessageNode = result.find((node) => node.className?.includes(ClassNames.MessageUser))
  const assistantMessageNode = result.find((node) => node.className?.includes(ClassNames.MessageAssistant))
  const messageNodes = result.filter((node) => node.className?.split(' ').includes(ClassNames.Message))
  expect(userMessageNode).toBeDefined()
  expect(assistantMessageNode).toBeDefined()
  expect(messageNodes).toHaveLength(2)
})

test('getStatusBarVirtualDom should render assistant tool call lines', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const toolCallItem = result.find((node) => node.className === ClassNames.ChatOrderedListItem && node.title === uri)
  const fileIconNode = result.find((node) => node.className === ClassNames.FileIcon)
  const toolPrefixNode = result.find((node) => node.text === 'read_file ')
  const fileNameNode = result.find((node) => node.text === 'index.html')
  const fileNameLinkNode = result.find((node) => node.type === VirtualDomElements.Span && node.className === ClassNames.ChatToolCallReadFileLink)

  expect(toolCallItem).toMatchObject({
    title: uri,
    type: VirtualDomElements.Li,
  })
  expect(fileIconNode).toBeDefined()
  expect(toolPrefixNode).toBeDefined()
  expect(fileNameNode).toBeDefined()
  expect(fileNameLinkNode).toMatchObject({
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickReadFile,
    type: VirtualDomElements.Span,
  })
})

test('getStatusBarVirtualDom should render assistant read_file path as clickable filename', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const fileNameLinkNode = result.find(
    (node) => node.type === VirtualDomElements.Span && node.className === ClassNames.ChatToolCallReadFileLink && node['data-uri'] === path,
  )

  expect(fileNameLinkNode).toMatchObject({
    'data-uri': path,
    onClick: DomEventListenerFunctions.HandleClickReadFile,
    type: VirtualDomElements.Span,
  })
})

test('getStatusBarVirtualDom should render assistant list_files uri as clickable filename', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const toolCallItem = result.find((node) => node.className === ClassNames.ChatOrderedListItem && node.title === uri)
  const toolPrefixNode = result.find((node) => node.text === 'list_files ')
  const fileNameNode = result.find((node) => node.text === 'src')
  const fileNameLinkNode = result.find(
    (node) => node.type === VirtualDomElements.Span && node.className === ClassNames.ChatToolCallReadFileLink && node['data-uri'] === uri,
  )

  expect(toolCallItem).toMatchObject({
    title: uri,
    type: VirtualDomElements.Li,
  })
  expect(toolPrefixNode).toBeDefined()
  expect(fileNameNode).toBeDefined()
  expect(fileNameLinkNode).toMatchObject({
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickReadFile,
    type: VirtualDomElements.Span,
  })
})

test('getStatusBarVirtualDom should render assistant list_file uri as clickable filename', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const toolCallItem = result.find((node) => node.className === ClassNames.ChatOrderedListItem && node.title === uri)
  const fileNameLinkNode = result.find(
    (node) => node.type === VirtualDomElements.Span && node.className === ClassNames.ChatToolCallReadFileLink && node['data-uri'] === uri,
  )

  expect(toolCallItem).toMatchObject({
    title: uri,
    type: VirtualDomElements.Li,
  })
  expect(fileNameLinkNode).toMatchObject({
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickReadFile,
    type: VirtualDomElements.Span,
  })
})

test('getStatusBarVirtualDom should render read_file not-found status', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const statusNode = result.find((node) => node.text === ' (not-found)')
  expect(statusNode).toBeDefined()
})

test('getStatusBarVirtualDom should render read_file error status with short message', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const statusNode = result.find((node) => node.text === ' (error: permission denied)')
  expect(statusNode).toBeDefined()
})

test('getStatusBarVirtualDom should render OpenRouter api key input and save button for missing key message', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openRouterApiKeyRequiredMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    'or-key-typed',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const apiKeyInput = result.find((node) => node.name === 'open-router-api-key')
  const saveButton = result.find((node) => node.name === 'save-openrouter-api-key')
  const openRouterButton = result.find((node) => node.name === 'open-openrouter-api-key-settings')
  expect(apiKeyInput).toMatchObject({
    onInput: DomEventListenerFunctions.HandleInput,
    type: VirtualDomElements.Input,
    value: 'or-key-typed',
  })
  expect(saveButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
  expect(openRouterButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render disabled OpenRouter save button with Saving text while api key is saving', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openRouterApiKeyRequiredMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    'or-key-typed',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'saving',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const saveButton = result.find((node) => node.name === 'save-openrouter-api-key')
  const savingText = result.find((node) => node.text === 'Saving...')
  expect(saveButton).toMatchObject({
    disabled: true,
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
  expect(savingText).toBeDefined()
})

test('getStatusBarVirtualDom should render OpenAPI api key input and save button for missing key message', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openApiApiKeyRequiredMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    'or-key-typed',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    'oa-key-typed',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const apiKeyInput = result.find((node) => node.name === 'open-api-api-key')
  const saveButton = result.find((node) => node.name === 'save-openapi-api-key')
  const openApiButton = result.find((node) => node.name === 'open-openapi-api-key-settings')
  expect(apiKeyInput).toMatchObject({
    onInput: DomEventListenerFunctions.HandleInput,
    type: VirtualDomElements.Input,
    value: 'oa-key-typed',
  })
  expect(saveButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
  expect(openApiButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render OpenRouter request failure reasons as ordered list', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: openRouterRequestFailedMessage, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
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

test('getStatusBarVirtualDom should render OpenRouter too many requests reasons as ordered list', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'assistant' as const, text: `${openRouterTooManyRequestsMessage} Limit resets: daily.`, time: '10:31' }],
      title: 'Chat 1',
    },
  ]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
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

test('getStatusBarVirtualDom should render ordered list from assistant message text', () => {
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

  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
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

test('getStatusBarVirtualDom should render selected chat title in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Project Plan' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const backButtonIndex = result.findIndex((node) => node.name === 'back')
  expect(backButtonIndex).toBeGreaterThan(-1)
  const titleNode = result[backButtonIndex + 3]
  expect(titleNode).toMatchObject({ text: 'Project Plan' })
  expect(titleNode).toBeDefined()
})

test('getStatusBarVirtualDom should render back button in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    0,
    0,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
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

test('getStatusBarVirtualDom should hide back button in list mode', () => {
  const result = GetChatViewDom.getChatVirtualDom([], '', '', '', 'list', models, 'test', false, 0, 0, '', 'idle', 28, 13, 'system-ui', 20, 0, 0)
  const backButton = result.find((node) => node.name === 'back')
  expect(backButton).toBeUndefined()
})

test('getStatusBarVirtualDom should not render token usage overview when disabled', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    false,
    100,
    1000,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
  const usageRing = result.find((node) => node.className === ClassNames.TokenUsageRing)
  expect(usageRing).toBeUndefined()
})

test('getStatusBarVirtualDom should render token usage overview when enabled', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetChatViewDom.getChatVirtualDom(
    sessions,
    'session-1',
    '',
    '',
    'detail',
    models,
    'test',
    true,
    100,
    1000,
    '',
    'idle',
    28,
    13,
    'system-ui',
    20,
    0,
    0,
  )
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

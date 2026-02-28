import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetStatusBarVirtualDom from '../src/parts/GetChatViewDom/GetChatViewDom.ts'

const models = [
  { id: 'test', name: 'test' },
  { id: 'codex-5.3', name: 'Codex 5.3' },
] as const

test('getStatusBarVirtualDom should render root chat container', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list', models, 'test')
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toMatchObject({
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should structure chat sections as header and list in list mode', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list', models, 'test')
  expect(result[0]).toMatchObject({
    childCount: 3,
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
    className: `${ClassNames.Button} ${ClassNames.ButtonPrimary} ${ClassNames.ButtonDisabled}`,
    disabled: true,
  })
  const detailsNode = result.find((node) => node.className === ClassNames.ChatDetails)
  expect(detailsNode).toBeUndefined()
})

test('getStatusBarVirtualDom should render session list entries', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'list', models, 'test')
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  const deleteButton = result.find((node) => node.name === 'SessionDelete' && node['data-id'] === 'session-1')
  const sessionLabel = result.find((node) => node.name === 'session:session-1' && node.className === ClassNames.ChatListItemLabel)
  expect(sessionButton).toBeDefined()
  expect(deleteButton).toBeDefined()
  expect(sessionLabel).toBeDefined()
  expect(sessionButton).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
    type: VirtualDomElements.Div,
  })
  expect(deleteButton).toMatchObject({
    onClick: DomEventListenerFunctions.HandleClickDelete,
  })
})

test('getStatusBarVirtualDom should render composer textarea', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', 'hello', 'detail', models, 'test')
  const composer = result.find((node) => node.name === 'composer')
  const sendButton = result.find((node) => node.name === 'send')
  expect(composer).toBeDefined()
  expect(sendButton).toBeDefined()
  expect(composer).toMatchObject({
    className: ClassNames.MultilineInputBox,
    onInput: DomEventListenerFunctions.HandleInput,
    type: VirtualDomElements.TextArea,
    value: 'hello',
  })
  expect(sendButton).toMatchObject({
    className: `${ClassNames.Button} ${ClassNames.ButtonPrimary}`,
    disabled: false,
    onClick: DomEventListenerFunctions.HandleSubmit,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render message rows for selected session', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'user' as const, text: 'Hi', time: '10:30' }],
      title: 'Chat 1',
    },
  ]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail', models, 'test')
  const messageNode = result.find((node) => node.className?.includes(ClassNames.MessageUser))
  expect(messageNode).toBeDefined()
})

test('getStatusBarVirtualDom should render settings button in header actions', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list', models, 'test')
  const settingsButton = result.find((node) => node.title === 'Settings')
  expect(settingsButton).toBeDefined()
  expect(settingsButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickSettings,
    role: 'button',
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render new chat button in header actions', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list', models, 'test')
  const newChatButton = result.find((node) => node.title === 'New Chat')
  expect(newChatButton).toBeDefined()
  expect(newChatButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickNew,
    role: 'button',
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render close button in header actions', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list', models, 'test')
  const closeButton = result.find((node) => node.title === 'Close Chat')
  expect(closeButton).toBeDefined()
  expect(closeButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickClose,
    role: 'button',
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should hide session list in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail', models, 'test')
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
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail', models, 'test')
  const userMessageNode = result.find((node) => node.className?.includes(ClassNames.MessageUser))
  const assistantMessageNode = result.find((node) => node.className?.includes(ClassNames.MessageAssistant))
  const messageNodes = result.filter((node) => node.className?.includes(ClassNames.Message))
  expect(userMessageNode).toBeDefined()
  expect(assistantMessageNode).toBeDefined()
  expect(messageNodes).toHaveLength(2)
})

test('getStatusBarVirtualDom should render selected chat title in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Project Plan' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail', models, 'test')
  const backButtonIndex = result.findIndex((node) => node.name === 'back')
  expect(backButtonIndex).toBeGreaterThan(-1)
  const titleNode = result[backButtonIndex + 3]
  expect(titleNode).toMatchObject({ text: 'Project Plan' })
  expect(titleNode).toBeDefined()
})

test('getStatusBarVirtualDom should render back button in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail', models, 'test')
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
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list', models, 'test')
  const backButton = result.find((node) => node.name === 'back')
  expect(backButton).toBeUndefined()
})

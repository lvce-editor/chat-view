import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetStatusBarVirtualDom from '../src/parts/GetChatViewDom/GetChatViewDom.ts'

test('getStatusBarVirtualDom should render root chat container', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list')
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toMatchObject({
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should structure chat sections as header and list in list mode', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list')
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
  const chatList = result.find((node) => node.className === ClassNames.ChatList)
  expect(chatList).toMatchObject({
    childCount: 1,
    className: ClassNames.ChatList,
    type: VirtualDomElements.Div,
  })
  const emptyStateMessage = result.find((node) => node.text === 'Click the + button to open a new chat.')
  expect(emptyStateMessage).toBeDefined()
  const composer = result.find((node) => node.name === 'composer')
  const sendButton = result.find((node) => node.name === 'send')
  expect(composer).toBeDefined()
  expect(sendButton).toBeDefined()
  const detailsNode = result.find((node) => node.className === ClassNames.ChatDetails)
  expect(detailsNode).toBeUndefined()
})

test('getStatusBarVirtualDom should render session list entries', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'list')
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  expect(sessionButton).toBeDefined()
  expect(sessionButton).toMatchObject({
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should render composer textarea', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', 'hello', 'detail')
  const composer = result.find((node) => node.name === 'composer')
  const sendButton = result.find((node) => node.name === 'send')
  expect(composer).toBeDefined()
  expect(sendButton).toBeDefined()
  expect(composer).toMatchObject({
    className: ClassNames.MultilineInputBox,
    type: VirtualDomElements.TextArea,
    value: 'hello',
  })
  expect(sendButton).toMatchObject({
    className: `${ClassNames.Button} ${ClassNames.ButtonPrimary}`,
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
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail')
  const messageNode = result.find((node) => node.className === ClassNames.Message)
  expect(messageNode).toBeDefined()
})

test('getStatusBarVirtualDom should render settings button in header actions', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list')
  const settingsButton = result.find((node) => node.title === 'Settings')
  expect(settingsButton).toBeDefined()
  expect(settingsButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickSettings,
    role: 'button',
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render close button in header actions', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list')
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
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail')
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  expect(sessionButton).toBeUndefined()
})

test('getStatusBarVirtualDom should render selected session messages in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [{ id: 'm1', role: 'user' as const, text: 'hello', time: '10:30' }], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail')
  const messageNodes = result.filter((node) => node.className === ClassNames.Message)
  expect(messageNodes).toHaveLength(1)
})

test('getStatusBarVirtualDom should render selected chat title in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Project Plan' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail')
  const backButtonIndex = result.findIndex((node) => node.name === 'back')
  expect(backButtonIndex).toBeGreaterThan(-1)
  const titleNode = result[backButtonIndex + 3]
  expect(titleNode).toMatchObject({ text: 'Project Plan' })
  expect(titleNode).toBeDefined()
})

test('getStatusBarVirtualDom should render back button in detail mode', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '', 'detail')
  const backButton = result.find((node) => node.name === 'back')
  expect(backButton).toBeDefined()
  expect(backButton).toMatchObject({
    className: ClassNames.IconButton,
    role: 'button',
    title: 'Back to chats',
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should hide back button in list mode', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '', 'list')
  const backButton = result.find((node) => node.name === 'back')
  expect(backButton).toBeUndefined()
})

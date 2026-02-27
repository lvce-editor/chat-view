import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetStatusBarVirtualDom from '../src/parts/GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

test('getStatusBarVirtualDom should render root chat container', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '')
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toMatchObject({
    className: `${ClassNames.Viewlet} Chat`,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should render session list entries', () => {
  const sessions = [
    { id: 'session-1', messages: [], title: 'Chat 1' },
    { id: 'session-2', messages: [], title: 'Chat 2' },
  ]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '')
  const sessionButton = result.find((node) => node.name === 'session:session-1')
  expect(sessionButton).toBeDefined()
  expect(sessionButton).toMatchObject({
    role: 'button',
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render composer textarea', () => {
  const sessions = [{ id: 'session-1', messages: [], title: 'Chat 1' }]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', 'hello')
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
    className: ClassNames.Button,
    type: VirtualDomElements.Button,
  })
})

test('getStatusBarVirtualDom should render message rows for selected session', () => {
  const sessions = [
    {
      id: 'session-1',
      messages: [{ id: 'm1', role: 'user' as const, text: 'Hi' }],
      title: 'Chat 1',
    },
  ]
  const result = GetStatusBarVirtualDom.getChatVirtualDom(sessions, 'session-1', '')
  const messageNode = result.find((node) => node.className === ClassNames.Message)
  expect(messageNode).toBeDefined()
})

test('getStatusBarVirtualDom should render settings button in header actions', () => {
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '')
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
  const result = GetStatusBarVirtualDom.getChatVirtualDom([], '', '')
  const closeButton = result.find((node) => node.title === 'Close Chat')
  expect(closeButton).toBeDefined()
  expect(closeButton).toMatchObject({
    className: ClassNames.IconButton,
    onClick: DomEventListenerFunctions.HandleClickClose,
    role: 'button',
    type: VirtualDomElements.Button,
  })
})

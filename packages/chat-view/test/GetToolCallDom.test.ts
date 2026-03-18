import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getToolCallDom } from '../src/parts/GetToolCallDom/GetToolCallDom.ts'

test('getToolCallDom should render render_html tool calls as native virtual dom previews', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      css: '.card { color: red; }',
      html: '<div class="card">Sunny</div>',
      title: 'Paris Weather',
    }),
    name: 'render_html',
    status: 'success',
  })

  expect(result).toHaveLength(7)
  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlLabel,
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toMatchObject({
    text: 'render_html: Paris Weather',
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlContent,
    type: VirtualDomElements.Div,
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlBody,
    type: VirtualDomElements.Div,
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: 'card',
    type: VirtualDomElements.Div,
  })
  expect(result[6]).toMatchObject({
    text: 'Sunny',
  })
})

test('getToolCallDom should include img src from render_html tool calls', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      css: '',
      html: '<img src="https://example.com/pic.png" />',
      title: 'Image Preview',
    }),
    name: 'render_html',
    status: 'success',
  })

  expect(result).toHaveLength(6)
  expect(result[5]).toEqual({
    childCount: 0,
    src: 'https://example.com/pic.png',
    type: VirtualDomElements.Img,
  })
})

test('getToolCallDom should display getWorkspaceUri as get_workspace_uri', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'getWorkspaceUri',
    status: 'success',
  })

  expect(result).toHaveLength(2)
  expect(result[1]).toMatchObject({
    text: 'get_workspace_uri',
  })
})

test('getToolCallDom should display getWorkspaceUri result value', () => {
  const uri = 'file:///home/user/some-folder'
  const result = getToolCallDom({
    arguments: '{}',
    name: 'getWorkspaceUri',
    result: uri,
    status: 'success',
  })

  expect(result).toHaveLength(5)
  expect(result[0]).toEqual({
    childCount: 3,
    className: ClassNames.ChatOrderedListItem,
    title: uri,
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toMatchObject({
    text: 'get_workspace_uri ',
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallReadFileLink,
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickReadFile,
    type: VirtualDomElements.Span,
  })
  expect(result[4]).toMatchObject({
    text: 'some-folder',
  })
})

test('getToolCallDom should not display empty object arguments', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'unknown_tool',
    status: 'success',
  })

  expect(result).toHaveLength(2)
  expect(result[1]).toMatchObject({
    text: 'unknown_tool',
  })
})

test('getToolCallDom should render ask_question tool calls', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      answers: ['Option A', 'Option B'],
      question: 'Which option?',
    }),
    name: 'ask_question',
  })

  expect(result).toHaveLength(8)
  expect(result[2]).toMatchObject({
    text: 'ask_question: Which option?',
  })
  expect(result[5]).toMatchObject({
    text: 'Option A',
  })
  expect(result[7]).toMatchObject({
    text: 'Option B',
  })
})

test('getToolCallDom should render ask_question with empty question', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      answers: ['A'],
      question: '',
    }),
    name: 'ask_question',
  })

  expect(result[2]).toMatchObject({
    text: 'ask_question: (empty question)',
  })
})

test('getToolCallDom should render ask_question with no answers', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      answers: [],
      question: 'No answers?',
    }),
    name: 'ask_question',
  })

  expect(result[5]).toMatchObject({
    text: '(no answers)',
  })
})

test('getToolCallDom should render write_file as filename with line count badges', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      content: 'const value = 2\n',
      path: 'src/main.ts',
    }),
    name: 'write_file',
    result: JSON.stringify({
      linesAdded: 1,
      linesDeleted: 1,
      ok: true,
      path: 'src/main.ts',
    }),
    status: 'success',
  })

  expect(result[0]).toEqual({
    childCount: 5,
    className: ClassNames.ChatOrderedListItem,
    title: 'src/main.ts',
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toMatchObject({
    text: 'write_file ',
  })
  expect(result[4]).toMatchObject({
    text: 'main.ts',
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: ClassNames.Insertion,
    type: VirtualDomElements.Span,
  })
  expect(result[6]).toMatchObject({
    text: ' +1',
  })
  expect(result[7]).toEqual({
    childCount: 1,
    className: ClassNames.Deletion,
    type: VirtualDomElements.Span,
  })
  expect(result[8]).toMatchObject({
    text: ' -1',
  })
  expect(result.find((node) => node.text === '"const value = 2\\n"')).toBeUndefined()
})

test('getToolCallDom should show write_file in progress for incomplete json arguments', () => {
  const result = getToolCallDom({
    arguments: '{"path":"src/main.ts","content":"const value',
    name: 'write_file',
  })

  expect(result).toHaveLength(2)
  expect(result[1]).toMatchObject({
    text: 'write_file (in progress)',
  })
})

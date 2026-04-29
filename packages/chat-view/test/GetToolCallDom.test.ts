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

  expect(result).toHaveLength(9)
  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[1]).toEqual({
    childCount: 2,
    className: ClassNames.ChatToolCallRenderHtmlLabel,
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'render_html',
  })
  expect(result[4]).toMatchObject({
    text: ': Paris Weather',
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlContent,
    type: VirtualDomElements.Div,
  })
  expect(result[6]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallRenderHtmlBody,
    type: VirtualDomElements.Div,
  })
  expect(result[7]).toEqual({
    childCount: 1,
    className: 'card',
    type: VirtualDomElements.Div,
  })
  expect(result[8]).toMatchObject({
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

  expect(result).toHaveLength(8)
  expect(result[7]).toEqual({
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

  expect(result).toHaveLength(3)
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[2]).toMatchObject({
    text: 'get_workspace_uri',
  })
})

test('getToolCallDom should render unknown tool name in ToolCallName span', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'unknown_tool',
    status: 'success',
  })

  expect(result).toHaveLength(3)
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result.find((node) => node.text === 'unknown_tool')).toBeDefined()
  expect(result.find((node) => node.text === ' (finished)')).toBeUndefined()
})

test('getToolCallDom should render getWorkspaceUri tool name text inside ToolCallName span', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'getWorkspaceUri',
    status: 'success',
  })

  expect(result.find((node) => node.text === 'get_workspace_uri')).toBeDefined()
})

test('getToolCallDom should not display empty object arguments', () => {
  const result = getToolCallDom({
    arguments: '{}',
    name: 'unknown_tool',
    status: 'success',
  })

  expect(result).toHaveLength(3)
  expect(result.find((node) => node.text === 'unknown_tool')).toBeDefined()
  expect(result.find((node) => node.text === ' (finished)')).toBeUndefined()
})

test('getToolCallDom should render grep_search query and expose raw arguments on hover', () => {
  const argumentsString = '{"includeIgnoredFiles":false,"includePattern":"**","isRegexp":false,"maxResults":10,"query":"hello"}'
  const result = getToolCallDom({
    arguments: argumentsString,
    name: 'grep_search',
    status: 'success',
  })

  expect(result).toEqual([
    {
      childCount: 2,
      className: ClassNames.ChatOrderedListItem,
      title: argumentsString,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'grep_search',
      type: VirtualDomElements.Text,
    }),
    expect.objectContaining({
      text: ' "hello"',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getToolCallDom should expose only nested arguments on hover for wrapped grep_search payloads', () => {
  const wrappedArguments = JSON.stringify({
    arguments: {
      includeIgnoredFiles: false,
      includePattern: '**/*',
      isRegexp: true,
      maxResults: 100,
      query: 'memoryMeasurement|MemoryMeasurement',
      useDefaultExcludes: true,
    },
    name: 'grep_search',
    result: {
      count: 1,
    },
  })
  const nestedArguments =
    '{"includeIgnoredFiles":false,"includePattern":"**/*","isRegexp":true,"maxResults":100,"query":"memoryMeasurement|MemoryMeasurement","useDefaultExcludes":true}'
  const result = getToolCallDom({
    arguments: wrappedArguments,
    name: 'grep_search',
    status: 'success',
  })

  expect(result).toEqual([
    {
      childCount: 2,
      className: ClassNames.ChatOrderedListItem,
      title: nestedArguments,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'grep_search',
      type: VirtualDomElements.Text,
    }),
    expect.objectContaining({
      text: ' "memoryMeasurement|MemoryMeasurement"',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getToolCallDom should render grep_search result only when result is available', () => {
  const result = getToolCallDom({
    arguments: '{"includeIgnoredFiles":false,"includePattern":"**","isRegexp":false,"maxResults":10,"query":"hello"}',
    name: 'grep_search',
    result: JSON.stringify({
      arguments: {
        query: 'hello',
      },
      name: 'grep_search',
      result: [
        {
          line: 3,
          path: 'src/example.ts',
          text: 'const hello = true',
        },
      ],
    }),
    status: 'success',
  })

  expect(result).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    expect.objectContaining({
      text: '[{"line":3,"path":"src/example.ts","text":"const hello = true"}]',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getToolCallDom should render glob baseUri as clickable folder name with full uri on hover', () => {
  const baseUri = 'file:///workspace/src'
  const pattern = '**/*'
  const result = getToolCallDom({
    arguments: JSON.stringify({
      baseUri,
      pattern,
    }),
    name: 'glob',
    status: 'success',
  })

  expect(result).toEqual([
    {
      childCount: 4,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'glob ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': baseUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      title: baseUri,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': baseUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'src',
      type: VirtualDomElements.Text,
    }),
    expect.objectContaining({
      text: ` "${pattern}"`,
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getToolCallDom should render finished glob tool calls with a match count', () => {
  const baseUri = 'file:///workspace/chat-view'
  const pattern = '**/*'
  const result = getToolCallDom({
    arguments: JSON.stringify({
      baseUri,
      pattern,
    }),
    name: 'glob',
    result: JSON.stringify(['a.ts', 'b.ts', 'c.ts', 'd.ts', 'e.ts']),
    status: 'success',
  })

  expect(result).toEqual([
    {
      childCount: 5,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'glob ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': baseUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      title: baseUri,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': baseUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'chat-view',
      type: VirtualDomElements.Text,
    }),
    expect.objectContaining({
      text: ` "${pattern}"`,
      type: VirtualDomElements.Text,
    }),
    expect.objectContaining({
      text: ', 5 matches',
      type: VirtualDomElements.Text,
    }),
  ])
})

test('getToolCallDom should render ask_question tool calls', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      answers: ['Option A', 'Option B'],
      question: 'Which option?',
    }),
    name: 'ask_question',
  })

  expect(result).toHaveLength(10)
  expect(result[1]).toEqual({
    childCount: 2,
    className: ClassNames.ChatToolCallQuestionText,
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'ask_question',
  })
  expect(result[4]).toMatchObject({
    text: ': Which option?',
  })
  expect(result[7]).toMatchObject({
    text: 'Option A',
  })
  expect(result[9]).toMatchObject({
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

  expect(result[4]).toMatchObject({
    text: ': (empty question)',
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

  expect(result[7]).toMatchObject({
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
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'write_file ',
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallReadFileLink,
    'data-uri': 'src/main.ts',
    onClick: DomEventListenerFunctions.HandleClickFileName,
    title: 'src/main.ts',
    type: VirtualDomElements.Span,
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallFileName,
    'data-uri': 'src/main.ts',
    onClick: DomEventListenerFunctions.HandleClickFileName,
    type: VirtualDomElements.Span,
  })
  expect(result[6]).toMatchObject({
    text: 'main.ts',
  })
  expect(result[7]).toEqual({
    childCount: 1,
    className: ClassNames.Insertion,
    type: VirtualDomElements.Span,
  })
  expect(result[8]).toMatchObject({
    text: ' +1',
  })
  expect(result[9]).toEqual({
    childCount: 1,
    className: ClassNames.Deletion,
    type: VirtualDomElements.Span,
  })
  expect(result[10]).toMatchObject({
    text: ' -1',
  })
  expect(result).toHaveLength(11)
  expect(result.find((node) => node.text === '"const value = 2\\n"')).toBeUndefined()
})

test('getToolCallDom should show write_file in progress for incomplete json arguments', () => {
  const result = getToolCallDom({
    arguments: '{"path":"src/main.ts","content":"const value',
    name: 'write_file',
  })

  expect(result).toHaveLength(4)
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[2]).toMatchObject({
    text: 'write_file',
  })
  expect(result[3]).toMatchObject({
    text: ' (in progress)',
  })
})

test('getToolCallDom should not render write_file diff badges when tool call failed', () => {
  const result = getToolCallDom({
    arguments: JSON.stringify({
      content: '<h1>Hello</h1>',
      path: 'index.html',
    }),
    errorMessage: 'Failed to save file: DOMException: A requested file or directory could not be found at the time an operation was processed.',
    name: 'write_file',
    result: '',
    status: 'error',
  })

  expect(result).toHaveLength(8)
  expect(result[0]).toEqual({
    childCount: 4,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'write_file ',
  })
  expect(result[6]).toMatchObject({
    text: 'index.html',
  })
  expect(result[7]).toMatchObject({
    text: ' (error: Failed to save file: DOMException: A requested file or directory could not be found at the time an operation was processed.)',
  })
  expect(result.find((node) => node.text === ' +0')).toBeUndefined()
  expect(result.find((node) => node.text === ' -0')).toBeUndefined()
})

test('getToolCallDom should render edit_file as filename with uri title', () => {
  const uri = 'file:///workspace/src/main.ts'
  const result = getToolCallDom({
    arguments: JSON.stringify({
      newString: 'const value = 2',
      oldString: 'const value = 1',
      uri,
    }),
    name: 'edit_file',
    status: 'success',
  })

  expect(result).toHaveLength(7)
  expect(result[0]).toEqual({
    childCount: 3,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'edit_file ',
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallReadFileLink,
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
    title: uri,
    type: VirtualDomElements.Span,
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallFileName,
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
    type: VirtualDomElements.Span,
  })
  expect(result[6]).toMatchObject({
    text: 'main.ts',
  })
})

test('getToolCallDom should render create_directory as folder name with uri title', () => {
  const uri = 'file:///workspace/src/components'
  const result = getToolCallDom({
    arguments: JSON.stringify({
      uri,
    }),
    name: 'create_directory',
    status: 'success',
  })

  expect(result).toHaveLength(7)
  expect(result[0]).toEqual({
    childCount: 3,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[2]).toEqual({
    childCount: 1,
    className: ClassNames.ToolCallName,
    type: VirtualDomElements.Span,
  })
  expect(result[3]).toMatchObject({
    text: 'create_directory ',
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallReadFileLink,
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
    title: uri,
    type: VirtualDomElements.Span,
  })
  expect(result[5]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallFileName,
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
    type: VirtualDomElements.Span,
  })
  expect(result[6]).toMatchObject({
    text: 'components',
  })
})

test('getToolCallDom should render getWorkspaceUri result with uri title on the filename link', () => {
  const uri = 'file:///workspace/chat-view'
  const result = getToolCallDom({
    arguments: '{}',
    name: 'getWorkspaceUri',
    result: uri,
    status: 'success',
  })

  expect(result).toHaveLength(7)
  expect(result[0]).toEqual({
    childCount: 3,
    className: ClassNames.ChatOrderedListItem,
    type: VirtualDomElements.Li,
  })
  expect(result[4]).toEqual({
    childCount: 1,
    className: ClassNames.ChatToolCallReadFileLink,
    'data-uri': uri,
    onClick: DomEventListenerFunctions.HandleClickFileName,
    title: uri,
    type: VirtualDomElements.Span,
  })
  expect(result[6]).toMatchObject({
    text: 'chat-view',
  })
})

test('getToolCallDom should render rename as from to filenames with full uri titles', () => {
  const oldUri = 'file:///workspace/packages/memory'
  const newUri = 'file:///workspace/packages/memory.bak'
  const result = getToolCallDom({
    arguments: JSON.stringify({
      newUri,
      oldUri,
    }),
    name: 'rename',
    status: 'success',
  })

  expect(result).toEqual([
    {
      childCount: 5,
      className: ClassNames.ChatOrderedListItem,
      title: `${oldUri} -> ${newUri}`,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'rename ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': oldUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      title: oldUri,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': oldUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'memory',
      type: VirtualDomElements.Text,
    }),
    expect.objectContaining({
      text: ' -> ',
      type: VirtualDomElements.Text,
    }),
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      'data-uri': newUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      title: newUri,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      'data-uri': newUri,
      onClick: DomEventListenerFunctions.HandleClickFileName,
      type: VirtualDomElements.Span,
    },
    expect.objectContaining({
      text: 'memory.bak',
      type: VirtualDomElements.Text,
    }),
  ])
})

import { expect, test } from '@jest/globals'
import * as GetRenderHtmlCss from '../src/parts/GetRenderHtmlCss/GetRenderHtmlCss.ts'

test('getRenderHtmlCss should return css from selected session render_html calls', () => {
  const result = GetRenderHtmlCss.getRenderHtmlCss(
    [
      {
        id: 'a',
        messages: [
          {
            id: '1',
            role: 'assistant',
            text: '',
            time: '',
            toolCalls: [
              {
                arguments: JSON.stringify({ css: '.card{color:red;}', html: '<div class="card">A</div>' }),
                name: 'render_html',
              },
              {
                arguments: JSON.stringify({ css: '.card{color:red;}', html: '<div class="card">A</div>' }),
                name: 'render_html',
              },
              {
                arguments: JSON.stringify({ uri: 'file:///x' }),
                name: 'read_file',
              },
            ],
          },
        ],
        title: 'A',
      },
    ],
    'a',
  )

  expect(result).toBe('.card{color:red;}')
})

test('getRenderHtmlCss should return empty string for missing session', () => {
  const result = GetRenderHtmlCss.getRenderHtmlCss([], 'missing')

  expect(result).toBe('')
})

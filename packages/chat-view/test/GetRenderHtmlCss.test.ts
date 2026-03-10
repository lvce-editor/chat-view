import { expect, test } from '@jest/globals'
import * as GetRenderHtmlCss from '../src/parts/GetRenderHtmlCss/GetRenderHtmlCss.ts'

test('getRenderHtmlCss should return css from selected session custom-ui blocks', () => {
  const result = GetRenderHtmlCss.getRenderHtmlCss(
    [
      {
        id: 'a',
        messages: [
          {
            id: '1',
            role: 'assistant',
            text: [
              '<custom-ui><html><div class="card">A</div></html><css>.card{color:red;}</css></custom-ui>',
              '<custom-ui><html><div class="card">A</div></html><css>.card{color:red;}</css></custom-ui>',
            ].join('\n\n'),
            time: '',
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

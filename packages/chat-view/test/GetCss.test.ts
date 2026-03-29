import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test.skip('getCss should include attachment height in chat send area height', () => {
  const css = getCss(28, 34, 100, 40, 13, 20, 'system-ui', 700, 0, 12, 12, 0, 10, 8, 8, 10, '')

  expect(css).toContain('--ChatComposerAttachmentsHeight: 34px;')
  expect(css).toContain('--ChatSendAreaHeight: 132px;')
  expect(css).toContain('.ChatOverlays{')
  expect(css).toContain('position: absolute;')
  expect(css).toContain('pointer-events: none;')
  expect(css).toContain('.ChatViewDropOverlayActive{')
  expect(css).toContain('background: rgba(255, 255, 255, 0.1);')
  expect(css).toContain('.ProjectListChevron{')
  expect(css).toContain('height: 16px;')
  expect(css).toContain('width: 16px;')
})

test.skip('getCss should size chat focus messages to their content width', () => {
  const css = getCss(28, 34, 100, 40, 13, 20, 'system-ui', 700, 0, 12, 12, 0, 10, 8, 8, 10, '')

  expect(css).toContain('.ChatFocus .ChatMessages > .Message{')
  expect(css).toContain('inline-size: fit-content;')
  expect(css).toContain('max-inline-size: min(100%, var(--ChatFocusContentMaxWidth));')
  expect(css).toContain('.ChatFocus .ChatMessages > .Message > .ChatMessageContent{')
  expect(css).toContain('max-inline-size: 100%;')
})

test('getCss should style submitted chat attachments separately from composer attachments', () => {
  const css = getCss(28, 34, 100, 40, 13, 20, 'system-ui', 700, 0, 12, 12, 0, 10, 8, 8, 10, '')

  expect(css).toContain('.ChatAttachments{')
  expect(css).toContain('.ChatAttachment{')
  expect(css).toContain('.ChatAttachmentPreview{')
  expect(css).toContain('.ChatMessages > .MessageUser .ChatAttachments{')
  expect(css).toContain('justify-content: flex-end;')
})

test('getCss should style invalid inputs with the input validation border color', () => {
  const css = getCss(28, 34, 100, 40, 13, 20, 'system-ui', 700, 0, 12, 12, 0, 10, 8, 8, 10, '')

  expect(css).toContain('.InputInvalid{')
  expect(css).toContain('border-color: var(--vscode-inputValidation-errorBorder, var(--vscode-errorForeground));')
})

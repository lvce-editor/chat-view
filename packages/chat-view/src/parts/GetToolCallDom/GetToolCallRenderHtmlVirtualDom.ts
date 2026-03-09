import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallStatusLabel } from './GetToolCallStatusLabel.ts'

const maxPreviewLength = 40_000

const parseRenderHtmlArguments = (rawArguments: string): { readonly css: string; readonly html: string; readonly title: string } | undefined => {
  try {
    const parsed = JSON.parse(rawArguments) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined
    }

    const html = typeof Reflect.get(parsed, 'html') === 'string' ? String(Reflect.get(parsed, 'html')) : ''
    if (!html) {
      return undefined
    }

    const css = typeof Reflect.get(parsed, 'css') === 'string' ? String(Reflect.get(parsed, 'css')) : ''
    const title = typeof Reflect.get(parsed, 'title') === 'string' ? String(Reflect.get(parsed, 'title')) : 'visual preview'

    return {
      css,
      html,
      title,
    }
  } catch {
    return undefined
  }
}

const getSrcDoc = (html: string, css: string): string => {
  const limitedHtml = html.slice(0, maxPreviewLength)
  const limitedCss = css.slice(0, maxPreviewLength)
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:12px;font-family:system-ui,sans-serif;color:#1f1f1f;background:#ffffff;}${limitedCss}</style></head><body>${limitedHtml}</body></html>`
}

export const getToolCallRenderHtmlVirtualDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  const parsed = parseRenderHtmlArguments(toolCall.arguments)
  if (!parsed) {
    return []
  }

  const statusLabel = getToolCallStatusLabel(toolCall)
  const label = `${toolCall.name}: ${parsed.title}${statusLabel}`
  const srcDoc = getSrcDoc(parsed.html, parsed.css)

  return [
    {
      childCount: 2,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallRenderHtmlLabel,
      type: VirtualDomElements.Div,
    },
    text(label),
    {
      childCount: 0,
      className: ClassNames.ChatToolCallRenderHtmlFrame,
      loading: 'lazy',
      sandbox: '',
      srcdoc: srcDoc,
      title: parsed.title,
      type: VirtualDomElements.Iframe,
    },
  ]
}

import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'

export interface ParsedRenderHtmlArguments {
  readonly css: string
  readonly html: string
  readonly title: string
}

export const parseRenderHtmlArguments = (rawArguments: string): ParsedRenderHtmlArguments | undefined => {
  try {
    const parsed = JSON.parse(rawArguments) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined
    }

    const rawHtml = getObjectProperty(parsed, 'html')
    const html = typeof rawHtml === 'string' ? rawHtml : ''
    if (!html) {
      return undefined
    }

    const rawCss = getObjectProperty(parsed, 'css')
    const css = typeof rawCss === 'string' ? rawCss : ''
    const rawTitle = getObjectProperty(parsed, 'title')
    const title = typeof rawTitle === 'string' ? rawTitle : 'visual preview'

    return {
      css,
      html,
      title,
    }
  } catch {
    return undefined
  }
}

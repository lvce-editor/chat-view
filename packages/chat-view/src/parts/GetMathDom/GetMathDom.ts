import { RendererWorker } from '@lvce-editor/rpc-registry'
import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageMathBlockNode, MessageMathInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ChatMathWorker from '../ChatMathWorker/ChatMathWorker.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

<<<<<<< HEAD
const cache = new Map<string, readonly VirtualDomNode[]>()
const pending = new Set<string>()

const scheduleRerender = (): void => {
  void RendererWorker.invoke('Chat.rerender').catch(() => {})
}

const requestMathDom = async (cacheKey: string, method: string, node: MessageMathInlineNode | MessageMathBlockNode): Promise<void> => {
  try {
    const dom = await ChatMathWorker.invoke<readonly VirtualDomNode[]>(method, node)
    cache.set(cacheKey, dom)
    scheduleRerender()
=======
const renderMath = (
  value: string,
  displayMode: boolean,
  useChatMathWorker = false,
): { readonly rootChildCount: number; readonly virtualDom: readonly VirtualDomNode[] } | undefined => {
  try {
    let html: string | undefined
    if (useChatMathWorker) {
      html = ChatMathWorker.tryRenderToString(value, displayMode)
    }
    if (typeof html !== 'string') {
      html = katex.renderToString(value, {
        displayMode,
        throwOnError: true,
      })
    }
    if (typeof html !== 'string') {
      return undefined
    }
    return parseHtmlToVirtualDomWithRootCount(html)
>>>>>>> origin/main
  } catch {
    // Allow retries when the worker is not ready yet.
    cache.delete(cacheKey)
  } finally {
    pending.delete(cacheKey)
  }
}

<<<<<<< HEAD
const getMathDom = (method: string, node: MessageMathInlineNode | MessageMathBlockNode): readonly VirtualDomNode[] | undefined => {
  const cacheKey = `${method}:${node.text}:${'displayMode' in node ? String(node.displayMode) : 'true'}`
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }
  if (!pending.has(cacheKey)) {
    pending.add(cacheKey)
    void requestMathDom(cacheKey, method, node)
  }
  return undefined
}

export const getMathInlineDom = (node: MessageMathInlineNode): readonly VirtualDomNode[] => {
  const rendered = getMathDom('ChatMath.getMathInlineDom', node)
=======
export const getMathInlineDom = (node: MessageMathInlineNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  const rendered = renderMath(node.text, node.displayMode, useChatMathWorker)
>>>>>>> origin/main
  if (!rendered) {
    const fallback = node.displayMode ? `$$${node.text}$$` : `$${node.text}$`
    return [text(fallback)]
  }
  return rendered
}

<<<<<<< HEAD
export const getMathBlockDom = (node: MessageMathBlockNode): readonly VirtualDomNode[] => {
  const rendered = getMathDom('ChatMath.getMathBlockDom', node)
=======
export const getMathBlockDom = (node: MessageMathBlockNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  const rendered = renderMath(node.text, true, useChatMathWorker)
>>>>>>> origin/main
  if (!rendered) {
    return [
      {
        childCount: 1,
        className: ClassNames.MarkdownMathBlock,
        type: VirtualDomElements.Div,
      },
      text(`$$\n${node.text}\n$$`),
    ]
  }
  return rendered
}

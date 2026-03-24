import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallAskQuestionVirtualDom } from '../GetToolCallAskQuestionVirtualDom/GetToolCallAskQuestionVirtualDom.ts'
import { getToolCallCreateDirectoryVirtualDom } from '../GetToolCallCreateDirectoryVirtualDom/GetToolCallCreateDirectoryVirtualDom.ts'
import { getToolCallEditFileVirtualDom } from '../GetToolCallEditFileVirtualDom/GetToolCallEditFileVirtualDom.ts'
import { getToolCallGetWorkspaceUriVirtualDom } from '../GetToolCallGetWorkspaceUriVirtualDom/GetToolCallGetWorkspaceUriVirtualDom.ts'
import { getToolCallLabel } from '../GetToolCallLabel/GetToolCallLabel.ts'
import { getToolCallReadFileVirtualDom } from '../GetToolCallReadFileVirtualDom/GetToolCallReadFileVirtualDom.ts'
import { getToolCallRenderHtmlVirtualDom } from '../GetToolCallRenderHtmlVirtualDom/GetToolCallRenderHtmlVirtualDom.ts'
import { getToolCallWriteFileVirtualDom } from '../GetToolCallWriteFileVirtualDom/GetToolCallWriteFileVirtualDom.ts'

const RE_TOOL_NAME_PREFIX = /^([^ :]+)/

export const getToolCallDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'getWorkspaceUri') {
    const virtualDom = getToolCallGetWorkspaceUriVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'read_file' || toolCall.name === 'list_files' || toolCall.name === 'list_file') {
    const virtualDom = getToolCallReadFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'write_file') {
    const virtualDom = getToolCallWriteFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'create_directory') {
    const virtualDom = getToolCallCreateDirectoryVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'edit_file') {
    const virtualDom = getToolCallEditFileVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'render_html') {
    const virtualDom = getToolCallRenderHtmlVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'ask_question') {
    const virtualDom = getToolCallAskQuestionVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  const label = getToolCallLabel(toolCall)
  const match = RE_TOOL_NAME_PREFIX.exec(label)
  const toolNamePrefix = match ? match[1] : label
  const suffix = label.slice(toolNamePrefix.length)
  const hasSuffix = suffix.length > 0
  return [
    {
      childCount: hasSuffix ? 2 : 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ToolCallName,
      type: VirtualDomElements.Span,
    },
    text(toolNamePrefix),
    ...(hasSuffix ? [text(suffix)] : []),
  ]
}

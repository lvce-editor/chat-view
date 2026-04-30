/* cspell:ignore sonarjs */

/* eslint-disable sonarjs/cognitive-complexity */

import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import { getToolCallAskQuestionVirtualDom } from '../GetToolCallAskQuestionVirtualDom/GetToolCallAskQuestionVirtualDom.ts'
import { getToolCallCreateDirectoryVirtualDom } from '../GetToolCallCreateDirectoryVirtualDom/GetToolCallCreateDirectoryVirtualDom.ts'
import { getToolCallDefaultDom } from '../GetToolCallDefaultDom/GetToolCallDefaultDom.ts'
import { getToolCallEditFileVirtualDom } from '../GetToolCallEditFileVirtualDom/GetToolCallEditFileVirtualDom.ts'
import { getToolCallGetWorkspaceUriVirtualDom } from '../GetToolCallGetWorkspaceUriVirtualDom/GetToolCallGetWorkspaceUriVirtualDom.ts'
import { getToolCallReadFileVirtualDom } from '../GetToolCallReadFileVirtualDom/GetToolCallReadFileVirtualDom.ts'
import { getToolCallRenameVirtualDom } from '../GetToolCallRenameVirtualDom/GetToolCallRenameVirtualDom.ts'
import { getToolCallRenderHtmlVirtualDom } from '../GetToolCallRenderHtmlVirtualDom/GetToolCallRenderHtmlVirtualDom.ts'
import { getToolCallWriteFileVirtualDom } from '../GetToolCallWriteFileVirtualDom/GetToolCallWriteFileVirtualDom.ts'

export const getToolCallDom = (toolCall: ChatToolCall): readonly VirtualDomNode[] => {
  if (toolCall.name === 'getWorkspaceUri') {
    const virtualDom = getToolCallGetWorkspaceUriVirtualDom(toolCall)
    if (virtualDom.length > 0) {
      return virtualDom
    }
  }

  if (toolCall.name === 'read_file' || toolCall.name === 'list_files' || toolCall.name === 'list_file' || toolCall.name === 'glob') {
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

  if (toolCall.name === 'rename') {
    const virtualDom = getToolCallRenameVirtualDom(toolCall)
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

  return getToolCallDefaultDom(toolCall)
}

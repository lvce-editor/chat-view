import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ComposerAttachment, ComposerAttachmentDisplayType } from '../ComposerAttachment/ComposerAttachment.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMessageContentDom } from '../GetMessageContentDom/GetMessageContentDom.ts'
import { getMissingOpenApiApiKeyDom } from '../GetMissingOpenApiApiKeyDom/GetMissingOpenApiApiKeyDom.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'
import { getOpenRouterRequestFailedDom } from '../GetOpenRouterRequestFailedDom/GetOpenRouterRequestFailedDom.ts'
import { getOpenRouterTooManyRequestsDom } from '../GetOpenRouterTooManyRequestsDom/GetOpenRouterTooManyRequestsDom.ts'
import { getToolCallsDom } from '../GetToolCallsDom/GetToolCallsDom.ts'
import { getTopLevelNodeCount } from '../GetTopLevelNodeCount/GetTopLevelNodeCount.ts'

const getChatAttachmentLabel = (displayType: ComposerAttachmentDisplayType): string => {
  switch (displayType) {
    case 'file':
      return 'File'
    case 'image':
      return 'Image'
    case 'invalid-image':
      return 'Invalid image'
    case 'text-file':
      return 'Text file'
    default:
      return displayType
  }
}

const getChatAttachmentClassName = (displayType: ComposerAttachmentDisplayType): string => {
  switch (displayType) {
    case 'file':
      return ClassNames.ChatAttachment
    case 'image':
      return ClassNames.ChatAttachmentImage
    case 'invalid-image':
      return ClassNames.ChatAttachmentInvalidImage
    case 'text-file':
      return ClassNames.ChatAttachmentTextFile
    default:
      return ClassNames.ChatAttachment
  }
}

const getChatAttachmentPreviewDom = (attachment: NonNullable<ChatMessage['attachments']>[number]): readonly VirtualDomNode[] => {
  if (!attachment.previewSrc) {
    return []
  }
  return [
    {
      alt: `Attachment preview for ${attachment.name}`,
      childCount: 0,
      className: ClassNames.ChatAttachmentPreview,
      src: attachment.previewSrc,
      type: VirtualDomElements.Img,
    },
  ]
}

const getChatAttachmentsDom = (attachments: readonly NonNullable<ChatMessage['attachments']>[number][]): readonly VirtualDomNode[] => {
  if (attachments.length === 0) {
    return []
  }
  return [
    {
      childCount: attachments.length,
      className: ClassNames.ChatAttachments,
      type: VirtualDomElements.Div,
    },
    ...attachments.flatMap((attachment) => {
      const previewDom = getChatAttachmentPreviewDom(attachment)
      return [
        {
          childCount: 1 + previewDom.length,
          className: mergeClassNames(ClassNames.ChatAttachment, getChatAttachmentClassName(attachment.displayType)),
          type: VirtualDomElements.Div,
        },
        ...previewDom,
        {
          childCount: 1,
          className: ClassNames.ChatAttachmentLabel,
          type: VirtualDomElements.Span,
        },
        {
          text: `${getChatAttachmentLabel(attachment.displayType)} · ${attachment.name}`,
          type: VirtualDomElements.Text,
        },
      ]
    }),
  ]
}

const getStandaloneImageAttachmentDom = (attachment: ComposerAttachment): readonly VirtualDomNode[] => {
  if (!attachment.previewSrc) {
    return getChatAttachmentsDom([attachment])
  }
  return [
    {
      alt: attachment.name,
      childCount: 0,
      className: ClassNames.ChatMessageImage,
      src: attachment.previewSrc,
      type: VirtualDomElements.Img,
    },
  ]
}

export const getChatMessageDom = (
  message: ChatMessage,
  parsedMessageContent: readonly MessageIntermediateNode[],
  _openRouterApiKeyInput: string,
  openApiApiKeyInput = '',
  openApiApiKeyState: 'idle' | 'saving' = 'idle',
  openApiApiKeysSettingsUrl = 'https://platform.openai.com/api-keys',
  openApiApiKeyInputPattern = '^sk-.+',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  useChatMathWorker = false,
  standaloneImageAttachment?: ComposerAttachment,
): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenApiApiKeyMissingMessage = message.role === 'assistant' && message.text === openApiApiKeyRequiredMessage
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  const isOpenRouterRequestFailedMessage = message.role === 'assistant' && message.text === openRouterRequestFailedMessage
  const isOpenRouterTooManyRequestsMessage = message.role === 'assistant' && message.text.startsWith(openRouterTooManyRequestsMessage)
  const isStandaloneImageMessage = !!standaloneImageAttachment
  const messageDom = isStandaloneImageMessage
    ? getStandaloneImageAttachmentDom(standaloneImageAttachment)
    : getMessageContentDom(parsedMessageContent, useChatMathWorker)
  const attachmentsDom = !isStandaloneImageMessage && message.role === 'user' ? getChatAttachmentsDom(message.attachments ?? []) : []
  const toolCallsDom = getToolCallsDom(message)
  const toolCallsChildCount = toolCallsDom.length > 0 ? 1 : 0
  const messageDomChildCount = getTopLevelNodeCount(messageDom)
  const attachmentsChildCount = attachmentsDom.length > 0 ? 1 : 0
  const extraChildCount =
    isOpenApiApiKeyMissingMessage || isOpenRouterApiKeyMissingMessage || isOpenRouterRequestFailedMessage || isOpenRouterTooManyRequestsMessage
      ? messageDomChildCount + 1 + toolCallsChildCount + attachmentsChildCount
      : messageDomChildCount + toolCallsChildCount + attachmentsChildCount
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: extraChildCount,
      className: isStandaloneImageMessage
        ? mergeClassNames(ClassNames.ChatMessageContent, ClassNames.ChatImageMessageContent)
        : ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    ...toolCallsDom,
    ...messageDom,
    ...attachmentsDom,
    ...(isOpenApiApiKeyMissingMessage
      ? getMissingOpenApiApiKeyDom(openApiApiKeyInput, openApiApiKeyState, openApiApiKeysSettingsUrl, openApiApiKeyInputPattern)
      : []),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyState) : []),
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
    ...(isOpenRouterTooManyRequestsMessage ? getOpenRouterTooManyRequestsDom() : []),
  ]
}

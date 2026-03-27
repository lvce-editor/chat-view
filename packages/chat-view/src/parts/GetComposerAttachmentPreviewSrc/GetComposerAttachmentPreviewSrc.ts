import type { ComposerAttachmentDisplayType } from '../ComposerAttachment/ComposerAttachment.ts'

const chunkSize = 0x80_00

const getBlobBase64 = async (blob: Blob): Promise<string> => {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCodePoint(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

export const getComposerAttachmentPreviewSrc = async (
  blob: Blob,
  displayType: ComposerAttachmentDisplayType,
  mimeType: string,
): Promise<string | undefined> => {
  if (displayType !== 'image') {
    return undefined
  }
  const base64 = await getBlobBase64(blob)
  return `data:${mimeType || 'application/octet-stream'};base64,${base64}`
}

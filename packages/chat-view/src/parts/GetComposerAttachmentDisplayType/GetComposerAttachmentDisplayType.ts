import type { ComposerAttachmentDisplayType } from '../ComposerAttachment/ComposerAttachment.ts'

const textFileRegex = /\.txt$/i
const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])

const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/')
}

const isTextFile = (name: string, mimeType: string): boolean => {
  return mimeType === 'text/plain' || textFileRegex.test(name)
}

const isValidPng = async (blob: Blob): Promise<boolean> => {
  const header = new Uint8Array(await blob.slice(0, pngSignature.length).arrayBuffer())
  if (header.length !== pngSignature.length) {
    return false
  }
  return pngSignature.every((value, index) => header[index] === value)
}

const isValidJpeg = async (blob: Blob): Promise<boolean> => {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9
}

const isValidImage = async (blob: Blob, mimeType: string): Promise<boolean> => {
  if (mimeType.startsWith('image/') && mimeType !== 'image/png' && mimeType !== 'image/jpeg') {
    return true
  }
  switch (mimeType) {
    case 'image/jpeg':
      return isValidJpeg(blob)
    case 'image/png':
      return isValidPng(blob)
    default:
      break
  }
  if (typeof createImageBitmap !== 'function') {
    return true
  }
  try {
    const imageBitmap = await createImageBitmap(blob)
    imageBitmap.close()
    return true
  } catch {
    return false
  }
}

export const getComposerAttachmentDisplayType = async (blob: Blob, name: string, mimeType: string): Promise<ComposerAttachmentDisplayType> => {
  if (isImageFile(mimeType)) {
    return (await isValidImage(blob, mimeType)) ? 'image' : 'invalid-image'
  }
  if (isTextFile(name, mimeType)) {
    return 'text-file'
  }
  return 'file'
}

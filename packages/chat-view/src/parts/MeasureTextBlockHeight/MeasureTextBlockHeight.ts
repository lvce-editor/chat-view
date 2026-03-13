import { RendererWorker } from '@lvce-editor/rpc-registry'

export const measureTextBlockHeight = async (
  text: string,
  fontFamily: string,
  fontSize: number,
  lineHeight: string,
  width: number,
): Promise<number> => {
  // @ts-ignore
  return RendererWorker.measureTextBlockHeight(text, fontFamily, fontSize, lineHeight, width)
}

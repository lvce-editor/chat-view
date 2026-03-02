import { RendererWorker } from '@lvce-editor/rpc-registry'

export const measureTextBlockHeight = async (
  text: string,
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  width: number,
): Promise<number> => {
  return RendererWorker.invoke('MeasureTextBlockHeight.measureTextBlockHeight', text, fontSize, fontFamily, lineHeight, width)
}

import { RendererWorker } from '@lvce-editor/rpc-registry'

interface RendererWorkerWithTextWidth {
  measureTextWidth(text: string, fontFamily: string, fontSize: number): Promise<number>
}

export const estimateTextWidth = (text: string, fontSize: number): number => {
  return Math.ceil(text.length * fontSize * 0.6)
}

export const measureTextWidth = async (text: string, fontFamily: string, fontSize: number): Promise<number> => {
  const rpc = RendererWorker as unknown as RendererWorkerWithTextWidth
  return rpc.measureTextWidth(text, fontFamily, fontSize)
}

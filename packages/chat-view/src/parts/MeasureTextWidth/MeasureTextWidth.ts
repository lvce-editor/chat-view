import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'

export const estimateTextWidth = (text: string, fontSize: number): number => {
  return Math.ceil(text.length * fontSize * 0.6)
}

export const measureTextWidth = async (text: string, fontFamily: string, fontSize: number): Promise<number> => {
  return TextMeasurementWorker.measureTextWidth(text, 400, fontSize, fontFamily, 0.5, false, 9)
}

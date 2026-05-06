export interface OpenAiInputTextPart {
  readonly text: string
  readonly type: 'input_text' | 'output_text'
}

export interface OpenAiInputImagePart {
  readonly image_url: string
  readonly type: 'input_image'
}

export type OpenAiInputPart = OpenAiInputTextPart | OpenAiInputImagePart

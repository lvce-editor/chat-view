export interface MissingApiKeyDomParams {
  readonly getApiKeyText: string
  readonly inputName: string
  readonly inputPattern?: string
  readonly inputRequired?: boolean
  readonly inputValue: string
  readonly openSettingsButtonName: string
  readonly placeholder: string
  readonly saveButtonDisabled?: boolean
  readonly saveButtonName: string
  readonly saveButtonText?: string
  readonly saveButtonType?: 'button' | 'submit'
  readonly useForm?: boolean
}

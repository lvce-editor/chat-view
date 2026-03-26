import type { ToolEnablement } from '../ToolEnablement/ToolEnablement.ts'

export type ChatTool = {
  readonly type: 'function'
  readonly function: {
    readonly name: string
    readonly description: string
    readonly parameters: {
      readonly type: 'object'
      readonly properties: Record<string, unknown>
      readonly required?: readonly string[]
      readonly additionalProperties: boolean
    }
  }
}

export type ExecuteToolOptions = {
  readonly assetDir: string
  readonly platform: number
  readonly toolEnablement?: ToolEnablement
  readonly useChatToolWorker?: boolean
  readonly workspaceUri?: string
}

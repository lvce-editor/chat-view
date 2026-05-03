import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'
import * as regex from '@lvce-editor/eslint-plugin-regex'

const sonarLintOverrideFiles = [
  'packages/chat-view-model/src/parts/HandleSubmit/HandleSubmit.ts',
  'packages/chat-view-model/src/parts/LoadContent/LoadContent.ts',
  'packages/chat-view/src/parts/CopyAsE2eTests/ToFinalMessages/ToFinalMessages.ts',
  'packages/chat-view/src/parts/GetAiResponse/GetAiResponse.ts',
  'packages/chat-view/src/parts/GetAiSessionTitle/GetAiSessionTitle.ts',
  'packages/chat-view/src/parts/GetChatMessageDom/GetChatMessageDom.ts',
  'packages/chat-view/src/parts/GetChatSendAreaDom/GetChatSendAreaDom.ts',
  'packages/chat-view/src/parts/GetMessagesDom/GetMessagesDom.ts',
  'packages/chat-view/src/parts/GetMockOpenApiAssistantText/GetMockOpenApiAssistantText.ts',
  'packages/chat-view/src/parts/GetOpenApiAssistantText/GetOpenApiAssistantText.ts',
  'packages/chat-view/src/parts/GetOpenApiErrorMessage/GetOpenApiErrorMessage.ts',
  'packages/chat-view/src/parts/GetOpenRouterAssistantText/GetOpenRouterAssistantText.ts',
  'packages/chat-view/src/parts/GetReadFileTarget/GetReadFileTarget.ts',
  'packages/chat-view/src/parts/GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts',
  'packages/chat-view/src/parts/GetToolCallDom/GetToolCallDom.ts',
  'packages/chat-view/src/parts/HandleClick/HandleClick.ts',
  'packages/chat-view/src/parts/HandleProjectListContextMenu/HandleProjectListContextMenu.ts',
  'packages/chat-view/src/parts/HandleSubmit/HandleSubmit.ts',
  'packages/chat-view/src/parts/LoadContent/LoadContent.ts',
  'packages/chat-view/src/parts/ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts',
  'packages/chat-view/test/GetAiResponse.test.ts',
  'packages/chat-view/test/HandleSubmit.test.ts',
]

export default [
  ...config.default,
  ...actions.default,
  ...tsconfig.default,
  ...regex.default,
  {
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
  {
    files: sonarLintOverrideFiles,
    rules: {
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/max-switch-cases': 'off',
      'sonarjs/no-parameter-reassignment': 'off',
      'sonarjs/regex-complexity': 'off',
    },
  },
  {
    files: ['packages/chat-view/test/GetToolCallDom.test.ts'],
    rules: {
      'jest/no-disabled-tests': 'off',
    },
  },
]

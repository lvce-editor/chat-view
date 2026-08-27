import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'
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

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  ...tsconfig.default,
  ...regex.default,
  {
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      'sonarjs/no-dead-store': 'off',
      'unicorn/empty-brace-spaces': 'off',
    },
  },
  {
    files: ['packages/**/*.ts'],
    rules: {
      'e2e/prefer-filesystem-set-files': 'off',
      'jest/no-disabled-tests': 'off',
      'sonarjs/prefer-specific-assertions': 'off',
      'sonarjs/super-linear-regex': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/consistent-conditional-object-spread': 'off',
      'unicorn/no-array-from-fill': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/no-incorrect-template-string-interpolation': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/no-unreadable-for-of-expression': 'off',
      'unicorn/no-unsafe-string-replacement': 'off',
      'unicorn/prefer-array-last-methods': 'off',
      'unicorn/prefer-array-some': 'off',
      'unicorn/prefer-await': 'off',
      'unicorn/prefer-else-if': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      'unicorn/prefer-iterator-to-array': 'off',
      'unicorn/prefer-minimal-ternary': 'off',
      'unicorn/prefer-url-href': 'off',
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
    files: ['packages/*/test/**/*.ts', 'packages/e2e/src/**/*.ts'],
    rules: {
      'virtual-dom/clickable-div-needs-role': 'off',
      'virtual-dom/no-inline-style': 'off',
      'virtual-dom/no-object-attribute-values': 'off',
      'virtual-dom/no-raw-text-children': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: ['packages/chat-view{,-model}/src/**/*.ts'],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: [
      'packages/chat-view-model/src/parts/ParsedMessageContent/ParsedMessageContent.ts',
      'packages/chat-view/src/parts/GetBasicChatTools/GetBasicChatTools.ts',
      'packages/chat-view/src/parts/ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts',
      'packages/chat-view/src/parts/ParsedMessageContent/ParsedMessageContent.ts',
      'packages/chat-view/src/parts/TestHelpers/RegisterMockChatMessageParsingRpc.ts',
    ],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
    },
  },
  {
    files: [
      'packages/chat-view/src/parts/GetChatHeaderDomFocusMode/GetChatHeaderDomFocusMode.ts',
      'packages/chat-view/src/parts/GetCustomSelectPopOverVirtualDom/GetCustomSelectPopOverVirtualDom.ts',
      'packages/chat-view/src/parts/GetGitBranchPickerVirtualDom/GetGitBranchPickerVirtualDom.ts',
      'packages/chat-view/src/parts/GetMessageNodeDom/GetTableDom.ts',
      'packages/chat-view/src/parts/GetReasoningEffortPickerVirtualDom/GetReasoningEffortPickerVirtualDom.ts',
      'packages/chat-view/src/parts/GetUsageOverviewDom/GetUsageOverviewDom.ts',
    ],
    rules: {
      'virtual-dom/no-inline-style': 'off',
    },
  },
])

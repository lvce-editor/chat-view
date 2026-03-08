import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'

export default [
	...config.default,
	...actions.default,
	...tsconfig.default,
	{
		files: ['packages/chat-debug-view/test/**/*.ts'],
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['packages/chat-debug-view/test/*.ts'],
				},
			},
		},
	},
]

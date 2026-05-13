import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup } from 'rollup'
import type { RollupOptions } from 'rollup'
import { root } from './root.ts'

const bundleTargets = [
  {
    input: join(root, 'packages/chat-view/src/chatViewWorkerMain.ts'),
    outputFile: join(root, '.tmp/dist/dist/chatViewWorkerMain.js'),
    external: ['ws', 'electron'],
  },
  {
    input: join(root, 'packages/chat-view-model/src/chatViewModelWorkerMain.ts'),
    outputFile: join(root, '.tmp/dist-chat-view-model/dist/chatViewModelWorkerMain.js'),
    external: ['node:buffer', 'electron', 'ws', 'node:worker_threads'],
  },
]

const getOptions = (input: string, outputFile: string, external: string[] = []): RollupOptions => {
  return {
    input,
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
    output: {
      file: outputFile,
      format: 'es',
      freeze: false,
      generatedCode: {
        constBindings: true,
        objectShorthand: true,
      },
    },
    external,
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
      nodeResolve(),
    ],
  }
}

const bundle = async (options: RollupOptions) => {
  const input = await rollup(options)
  // @ts-ignore
  await input.write(options.output)
}

export const bundleJs = async () => {
  for (const target of bundleTargets) {
    const options = getOptions(target.input, target.outputFile, target.external)
    await bundle(options)
  }
}

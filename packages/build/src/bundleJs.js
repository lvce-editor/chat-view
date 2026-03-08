import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup } from 'rollup'
import { root } from './root.js'

const getOptions = (input, outputFile, external = []) => {
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

const bundle = async (options) => {
  const input = await rollup(options)
  // @ts-ignore
  await input.write(options.output)
}

export const bundleJs = async () => {
  const options = getOptions(join(root, 'packages/chat-view/src/chatViewWorkerMain.ts'), join(root, '.tmp/dist/dist/chatViewWorkerMain.js'), [
    'ws',
    'electron',
  ])
  await bundle(options)
}

export const bundleNetworkWorkerJs = async () => {
  const options = getOptions(
    join(root, 'packages/chat-network-worker/src/chatNetworkWorkerMain.ts'),
    join(root, '.tmp/dist-chat-network-worker/dist/chatNetworkWorkerMain.js'),
    ['@lvce-editor/rpc', 'ws', 'electron'],
  )
  await bundle(options)
}

export const bundleToolWorkerJs = async () => {
  const options = getOptions(
    join(root, 'packages/chat-tool-worker/src/chatToolWorkerMain.ts'),
    join(root, '.tmp/dist-chat-tool-worker/dist/chatToolWorkerMain.js'),
    ['@lvce-editor/rpc'],
  )
  await bundle(options)
}

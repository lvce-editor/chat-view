import { execa } from 'execa'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const esbuild = join(root, 'packages', 'build', 'node_modules', '.bin', 'esbuild')

const commonArgs = ['--format=esm', '--bundle', '--platform=node', '--watch']

const tasks = [
  {
    input: 'packages/chat-view/src/chatViewWorkerMain.ts',
    outputDir: '.tmp/dist/dist',
    outputFile: '.tmp/dist/dist/chatViewWorkerMain.js',
    external: ['node:buffer', 'electron', 'ws', 'node:worker_threads'],
  },
  {
    input: 'packages/chat-debug-view/src/chatDebugViewWorkerMain.ts',
    outputDir: '.tmp/dist-chat-debug-view/dist',
    outputFile: '.tmp/dist-chat-debug-view/dist/chatDebugViewWorkerMain.js',
    external: ['electron', 'ws'],
  },
  {
    input: 'packages/chat-network-worker/src/chatNetworkWorkerMain.ts',
    outputDir: '.tmp/dist-chat-network-worker/dist',
    outputFile: '.tmp/dist-chat-network-worker/dist/chatNetworkWorkerMain.js',
    external: ['@lvce-editor/rpc', 'electron', 'ws'],
  },
  {
    input: 'packages/chat-tool-worker/src/chatToolWorkerMain.ts',
    outputDir: '.tmp/dist-chat-tool-worker/dist',
    outputFile: '.tmp/dist-chat-tool-worker/dist/chatToolWorkerMain.js',
    external: ['@lvce-editor/rpc'],
  },
]

const main = async () => {
  for (const task of tasks) {
    await mkdir(join(root, task.outputDir), { recursive: true })
    const args = [...commonArgs, ...task.external.map((item) => `--external:${item}`), task.input, `--outfile=${task.outputFile}`]
    execa(esbuild, args, {
      cwd: root,
      stdio: 'inherit',
    })
  }
}

main()

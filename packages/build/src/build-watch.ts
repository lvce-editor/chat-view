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
    input: 'packages/chat-view-model/src/chatViewModelWorkerMain.ts',
    outputDir: '.tmp/dist-chat-view-model/dist',
    outputFile: '.tmp/dist-chat-view-model/dist/chatViewModelWorkerMain.js',
    external: ['node:buffer', 'electron', 'ws', 'node:worker_threads'],
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

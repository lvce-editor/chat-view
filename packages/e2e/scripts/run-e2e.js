import { spawn } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = process.cwd()
const sourcePath = join(cwd, 'src')
const temporaryRoot = await mkdtemp(join(tmpdir(), 'chat-view-e2e-'))
const testWithPlaywrightPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/package.json'))
const testWithPlaywrightPath = join(dirname(testWithPlaywrightPackagePath), 'bin', 'test-with-playwright.js')

const copyTests = async (entries, name) => {
  const absoluteTestPath = join(temporaryRoot, name)
  const temporarySourcePath = join(absoluteTestPath, 'src')
  await mkdir(temporarySourcePath, { recursive: true })
  for (const entry of entries) {
    await cp(join(sourcePath, entry.name), join(temporarySourcePath, entry.name))
  }
  return absoluteTestPath
}

const run = async (testPath, extraArguments = []) => {
  const child = spawn(
    process.execPath,
    [
      testWithPlaywrightPath,
      '--only-extension=.',
      `--test-path=${testPath}`,
      '--server-path=../server/src/dev.js',
      ...process.argv.slice(2),
      ...extraArguments,
    ],
    {
      cwd,
      stdio: 'inherit',
    },
  )
  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('close', (code) => resolve(code ?? 1))
  })
}

const main = async () => {
  const entries = (await readdir(sourcePath, { withFileTypes: true })).filter((entry) => entry.isFile())
  const contextMenuTests = entries.filter((entry) => entry.name.includes('context-menu'))
  const isolatedTests = entries.filter((entry) => !entry.name.includes('context-menu'))
  const filter = process.argv.slice(2).find((argument) => argument.startsWith('--filter='))
  const contextMenuOnly = filter?.includes('context-menu') ?? false
  if (!contextMenuOnly) {
    const isolatedTestPath = await copyTests(isolatedTests, 'isolated')
    const isolatedExitCode = await run(isolatedTestPath)
    if (isolatedExitCode !== 0) {
      return isolatedExitCode
    }
    if (filter) {
      return 0
    }
  }
  const contextMenuTestPath = await copyTests(contextMenuTests, 'context-menu')
  return run(contextMenuTestPath, ['--reuse-page'])
}

process.exitCode = await main()

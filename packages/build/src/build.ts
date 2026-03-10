import { execa } from 'execa'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bundleJs, bundleNetworkWorkerJs, bundleToolWorkerJs } from './bundleJs.ts'
import { root } from './root.ts'

const dist = join(root, '.tmp', 'dist')
const networkWorkerDist = join(root, '.tmp', 'dist-chat-network-worker')
const toolWorkerDist = join(root, '.tmp', 'dist-chat-tool-worker')

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path, json) => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const getGitTagFromGit = async () => {
  const { stdout, stderr, exitCode } = await execa('git', ['describe', '--exact-match', '--tags'], {
    reject: false,
  })
  if (exitCode) {
    if (exitCode === 128 && stderr.startsWith('fatal: no tag exactly matches')) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getVersion = async () => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    if (RG_VERSION.startsWith('v')) {
      return RG_VERSION.slice(1)
    }
    return RG_VERSION
  }
  if (GIT_TAG) {
    if (GIT_TAG.startsWith('v')) {
      return GIT_TAG.slice(1)
    }
    return GIT_TAG
  }
  return getGitTagFromGit()
}

await rm(dist, { recursive: true, force: true })
await rm(networkWorkerDist, { recursive: true, force: true })
await rm(toolWorkerDist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await mkdir(networkWorkerDist, { recursive: true })
await mkdir(toolWorkerDist, { recursive: true })

await bundleJs()
await bundleNetworkWorkerJs()
await bundleToolWorkerJs()

const version = await getVersion()

const packageJson = await readJson(join(root, 'packages', 'chat-view', 'package.json'))

delete packageJson.scripts
delete packageJson.dependencies
delete packageJson.devDependencies
delete packageJson.prettier
delete packageJson.jest
delete packageJson.xo
delete packageJson.directories
delete packageJson.nodemonConfig
packageJson.version = version
packageJson.main = 'dist/chatViewWorkerMain.js'

await writeJson(join(dist, 'package.json'), packageJson)

await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))

const networkWorkerPackageJson = await readJson(join(root, 'packages', 'chat-network-worker', 'package.json'))

delete networkWorkerPackageJson.scripts
delete networkWorkerPackageJson.dependencies
delete networkWorkerPackageJson.devDependencies
delete networkWorkerPackageJson.prettier
delete networkWorkerPackageJson.jest
delete networkWorkerPackageJson.xo
delete networkWorkerPackageJson.directories
delete networkWorkerPackageJson.nodemonConfig
networkWorkerPackageJson.version = version
networkWorkerPackageJson.main = 'dist/chatNetworkWorkerMain.js'

await writeJson(join(networkWorkerDist, 'package.json'), networkWorkerPackageJson)
await cp(join(root, 'README.md'), join(networkWorkerDist, 'README.md'))
await cp(join(root, 'LICENSE'), join(networkWorkerDist, 'LICENSE'))

const toolWorkerPackageJson = await readJson(join(root, 'packages', 'chat-tool-worker', 'package.json'))

delete toolWorkerPackageJson.scripts
delete toolWorkerPackageJson.dependencies
delete toolWorkerPackageJson.devDependencies
delete toolWorkerPackageJson.prettier
delete toolWorkerPackageJson.jest
delete toolWorkerPackageJson.xo
delete toolWorkerPackageJson.directories
delete toolWorkerPackageJson.nodemonConfig
toolWorkerPackageJson.version = version
toolWorkerPackageJson.main = 'dist/chatToolWorkerMain.js'

await writeJson(join(toolWorkerDist, 'package.json'), toolWorkerPackageJson)
await cp(join(root, 'README.md'), join(toolWorkerDist, 'README.md'))
await cp(join(root, 'LICENSE'), join(toolWorkerDist, 'LICENSE'))

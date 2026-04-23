import { execa } from 'execa'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bundleJs } from './bundleJs.ts'
import { root } from './root.ts'

const dist = join(root, '.tmp', 'dist')
const distChatViewModel = join(root, '.tmp', 'dist-chat-view-model')

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path, json) => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const preparePackageJson = (packageJson, version, main) => {
  delete packageJson.scripts
  delete packageJson.dependencies
  delete packageJson.devDependencies
  delete packageJson.prettier
  delete packageJson.jest
  delete packageJson.xo
  delete packageJson.directories
  delete packageJson.nodemonConfig
  packageJson.version = version
  packageJson.main = main
  return packageJson
}

const writePackagedArtifact = async (packageName, outputDir, main, version) => {
  const packageJson = await readJson(join(root, 'packages', packageName, 'package.json'))
  await writeJson(join(outputDir, 'package.json'), preparePackageJson(packageJson, version, main))
  await cp(join(root, 'README.md'), join(outputDir, 'README.md'))
  await cp(join(root, 'LICENSE'), join(outputDir, 'LICENSE'))
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
await rm(distChatViewModel, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await mkdir(distChatViewModel, { recursive: true })

await bundleJs()

const version = await getVersion()

await writePackagedArtifact('chat-view', dist, 'dist/chatViewWorkerMain.js', version)
await writePackagedArtifact('chat-view-model', distChatViewModel, 'dist/chatViewModelWorkerMain.js', version)

import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 660_000

export const instantiations = 200_000

export const instantiationsPath = join(root, 'packages', 'chat-view')

export const workerPath = join(root, '.tmp/dist/dist/chatViewWorkerMain.js')

export const playwrightPath = new URL('../../e2e/node_modules/playwright/index.mjs', import.meta.url).toString()

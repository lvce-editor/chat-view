import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

const registry = ViewletRegistry.create<ChatState>()

export const { get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = registry

const pendingUpdates = new Map<number, Promise<void>>()

export interface ApplyStateUpdateOptions {
	readonly fallbackState?: ChatState
	readonly rerender?: boolean
}

export interface StateUpdateResult<T> {
	readonly nextState: ChatState
	readonly result?: T
}

const getLatestState = (uid: number, fallbackState?: ChatState): ChatState => {
	try {
		const { newState } = get(uid)
		return newState
	} catch {
		if (fallbackState) {
			return fallbackState
		}
		throw new Error(`No chat state found for uid ${uid}`)
	}
}

const normalizeStateUpdateResult = <T>(value: ChatState | StateUpdateResult<T>): StateUpdateResult<T> => {
	if ('nextState' in value) {
		return value
	}
	return {
		nextState: value,
	}
}

export const applyStateUpdate = async <T>(
	uid: number,
	updater: (state: ChatState) => Promise<ChatState | StateUpdateResult<T>> | ChatState | StateUpdateResult<T>,
	options: ApplyStateUpdateOptions = {},
): Promise<StateUpdateResult<T>> => {
	const { fallbackState, rerender = false } = options
	const previousUpdate = pendingUpdates.get(uid) ?? Promise.resolve()
	let updateResult: StateUpdateResult<T> | undefined
	const currentUpdate = previousUpdate.catch(() => undefined).then(async () => {
		const currentState = getLatestState(uid, fallbackState)
		updateResult = normalizeStateUpdateResult(await updater(currentState))
		if (updateResult.nextState !== currentState) {
			set(uid, currentState, updateResult.nextState)
		}
		if (rerender) {
			// @ts-ignore
			await RendererWorker.invoke('Chat.rerender')
		}
	})
	pendingUpdates.set(
		uid,
		currentUpdate.finally(() => {
			if (pendingUpdates.get(uid) === currentUpdate) {
				pendingUpdates.delete(uid)
			}
		}),
	)
	await currentUpdate
	return updateResult || {
		nextState: getLatestState(uid, fallbackState),
	}
}

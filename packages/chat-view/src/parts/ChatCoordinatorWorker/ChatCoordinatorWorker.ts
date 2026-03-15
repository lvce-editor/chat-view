interface RpcLike {
  readonly invoke: (method: string, ...params: readonly unknown[]) => Promise<unknown>
}

let rpc: RpcLike | undefined

export const set = (value: RpcLike): void => {
  rpc = value
}

export const invoke = async (method: string, ...params: readonly unknown[]): Promise<unknown> => {
  if (!rpc) {
    throw new Error('ChatCoordinatorWorker is not initialized')
  }
  return rpc.invoke(method, ...params)
}

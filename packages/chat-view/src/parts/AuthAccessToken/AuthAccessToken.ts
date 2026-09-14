const accessTokens = new Map<number, string>()

export const get = (uid: number): string => {
  return accessTokens.get(uid) || ''
}

export const set = (uid: number, accessToken: string): void => {
  if (accessToken) {
    accessTokens.set(uid, accessToken)
  } else {
    accessTokens.delete(uid)
  }
}

export const clear = (uid: number): void => {
  accessTokens.delete(uid)
}

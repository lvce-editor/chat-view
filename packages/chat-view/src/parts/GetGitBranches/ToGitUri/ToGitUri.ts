const slashAtEndRegex = /\/$/

export const toGitUri = (baseUri: string, ...segments: readonly string[]): string => {
  const url = new URL(baseUri.endsWith('/') ? baseUri : `${baseUri}/`)
  for (const segment of segments) {
    url.pathname = `${url.pathname.replace(slashAtEndRegex, '')}/${segment
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')}`
  }
  return url.toString()
}

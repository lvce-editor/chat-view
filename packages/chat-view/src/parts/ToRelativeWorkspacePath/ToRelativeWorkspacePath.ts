export const toRelativeWorkspacePath = (workspaceUri: string, fileUri: string): string | undefined => {
  let workspaceUrl: URL
  let fileUrl: URL
  try {
    workspaceUrl = new URL(workspaceUri)
    fileUrl = new URL(fileUri)
  } catch {
    return undefined
  }
  if (workspaceUrl.protocol !== 'file:' || fileUrl.protocol !== 'file:') {
    return undefined
  }
  const workspacePathname = decodeURIComponent(workspaceUrl.pathname).replace(/\/+$/, '')
  const filePathname = decodeURIComponent(fileUrl.pathname)
  const workspacePrefix = `${workspacePathname}/`
  if (filePathname !== workspacePathname && !filePathname.startsWith(workspacePrefix)) {
    return undefined
  }
  const relativePath = filePathname.slice(workspacePathname.length).replace(/^\/+/, '')
  if (!relativePath) {
    return undefined
  }
  return relativePath
    .split(/[\\/]/)
    .filter((segment) => segment && segment !== '.')
    .join('/')
}

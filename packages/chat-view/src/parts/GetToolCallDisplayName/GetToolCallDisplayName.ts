export const getToolCallDisplayName = (name: string): string => {
  if (name === 'getWorkspaceUri') {
    return 'get_workspace_uri'
  }
  return name
}

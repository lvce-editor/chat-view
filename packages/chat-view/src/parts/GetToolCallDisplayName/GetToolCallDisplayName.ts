export const getToolCallDisplayName = (name: string): string => {
  if (name === 'getWorkspaceUri') {
    return 'get_workspace_uri'
  }
  if (name === 'web_search_call') {
    return 'web_search'
  }
  return name
}

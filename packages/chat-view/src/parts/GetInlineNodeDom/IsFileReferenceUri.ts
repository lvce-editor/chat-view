export const isFileReferenceUri = (href: string): boolean => {
  const normalized = href.trim().toLowerCase()
  return normalized.startsWith('file://') || normalized.startsWith('vscode-references://')
}

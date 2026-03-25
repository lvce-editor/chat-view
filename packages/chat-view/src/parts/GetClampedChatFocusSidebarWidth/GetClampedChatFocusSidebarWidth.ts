export const defaultChatFocusSidebarWidth = 280

const minimumChatFocusSidebarWidth = 160
const maximumChatFocusSidebarWidth = 420
const minimumChatFocusContentWidth = 320

export const getClampedChatFocusSidebarWidth = (sidebarWidth: number, totalWidth: number): number => {
  const hardMaximum =
    totalWidth > 0 ? Math.max(minimumChatFocusSidebarWidth, totalWidth - minimumChatFocusContentWidth) : maximumChatFocusSidebarWidth
  const effectiveMaximum = Math.min(maximumChatFocusSidebarWidth, hardMaximum)
  return Math.max(minimumChatFocusSidebarWidth, Math.min(effectiveMaximum, sidebarWidth))
}

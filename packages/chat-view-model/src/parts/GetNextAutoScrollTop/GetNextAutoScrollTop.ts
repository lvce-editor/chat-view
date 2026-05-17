const AutoScrollTopA = Number.MAX_SAFE_INTEGER
const AutoScrollTopB = Number.MAX_SAFE_INTEGER - 1

export const getNextAutoScrollTop = (currentScrollTop: number): number => {
  return currentScrollTop === AutoScrollTopA ? AutoScrollTopB : AutoScrollTopA
}

import { MenuEntryId } from '@lvce-editor/constants'

export const getMenuEntryIds = (): readonly number[] => {
  return [MenuEntryId.ActivityBar, MenuEntryId.ActivityBarAdditionalViews, MenuEntryId.Settings]
}

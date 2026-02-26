import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetStatusBarItemsVirtualDom from '../GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.ts'

export const getStatusBarItemsRightDom = (statusBarItemsRight: readonly StatusBarItem[]): readonly VirtualDomNode[] => {
  return GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsRight, ClassNames.StatusBarItemsRight)
}

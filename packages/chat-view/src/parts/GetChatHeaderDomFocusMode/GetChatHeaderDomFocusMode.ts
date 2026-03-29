import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const focusHeaderStyle =
  'align-items:center;border-bottom:1px solid var(--vscode-panel-border, transparent);display:flex;gap:12px;justify-content:space-between;padding:8px 12px;'

const focusHeaderMetaStyle = 'align-items:baseline;display:flex;gap:8px;min-width:0;overflow:hidden;'

const focusHeaderTitleStyle = 'margin:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'

const focusHeaderProjectStyle = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'

const focusHeaderActionsStyle = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;'

export const getChatHeaderDomFocusMode = (selectedSessionTitle: string, selectedProjectName: string): readonly VirtualDomNode[] => {
  const hasProjectName = !!selectedProjectName
  return [
    {
      childCount: 2,
      className: ClassNames.ChatFocusHeader,
      style: focusHeaderStyle,
      type: VirtualDomElements.Header,
    },
    {
      childCount: hasProjectName ? 2 : 1,
      className: ClassNames.ChatName,
      style: focusHeaderMetaStyle,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatHeaderLabel,
      style: focusHeaderTitleStyle,
      type: VirtualDomElements.H2,
    },
    text(selectedSessionTitle),
    ...(hasProjectName
      ? [
          {
            childCount: 1,
            className: mergeClassNames(ClassNames.LabelDetail, ClassNames.ChatFocusProject),
            style: focusHeaderProjectStyle,
            type: VirtualDomElements.Span,
          },
          text(selectedProjectName),
        ]
      : []),
    {
      'aria-label': 'focus header actions',
      childCount: 0,
      className: ClassNames.ChatFocusActions,
      role: AriaRoles.ToolBar,
      style: focusHeaderActionsStyle,
      type: VirtualDomElements.Div,
    },
  ]
}

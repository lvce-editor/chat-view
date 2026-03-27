import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const focusHeaderStyle =
  'align-items:center;border-bottom:1px solid var(--vscode-panel-border, transparent);display:flex;gap:12px;justify-content:space-between;padding:8px 12px;'

const focusHeaderMetaStyle = 'align-items:baseline;display:flex;gap:8px;min-width:0;overflow:hidden;'

const focusHeaderTitleStyle = 'margin:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'

const focusHeaderProjectStyle = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'

const focusHeaderActionsStyle = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;'

const focusHeaderButtonStyle = 'white-space:nowrap;'

const getFocusHeaderActionButtonDom = (label: string, name: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      inputType: 'button',
      name,
      onClick: DomEventListenerFunctions.HandleClick,
      style: focusHeaderButtonStyle,
      title: label,
      type: VirtualDomElements.Button,
    },
    text(label),
  ]
}

export const getChatHeaderDomFocusMode = (selectedSessionTitle: string, selectedProjectName: string): readonly VirtualDomNode[] => {
  const items = [
    [Strings.addAction(), InputName.FocusAddAction],
    [Strings.openInVsCode(), InputName.FocusOpenInVsCode],
    [Strings.commit(), InputName.FocusCommit],
    [Strings.openTerminal(), InputName.FocusOpenTerminal],
    [Strings.showDiff(), InputName.FocusShowDiff],
  ] as const
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
      childCount: items.length,
      className: ClassNames.ChatFocusActions,
      role: AriaRoles.ToolBar,
      style: focusHeaderActionsStyle,
      type: VirtualDomElements.Div,
    },
    ...items.flatMap(([label, name]) => getFocusHeaderActionButtonDom(label, name)),
  ]
}

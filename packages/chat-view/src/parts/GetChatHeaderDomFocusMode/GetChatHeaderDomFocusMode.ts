import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderAuthDom } from '../GetChatHeaderAuthDom/GetChatHeaderAuthDom.ts'
import { getHeaderActionVirtualDom } from '../GetHeaderActionVirtualDom/GetHeaderActionVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const focusHeaderStyle =
  'align-items:center;border-bottom:1px solid var(--vscode-panel-border, transparent);display:flex;gap:12px;justify-content:space-between;padding:8px 12px;'

const focusHeaderMetaStyle = 'align-items:baseline;display:flex;gap:8px;min-width:0;overflow:hidden;'

const focusHeaderTitleStyle = 'margin:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'

const focusHeaderProjectStyle = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'

const focusHeaderActionsStyle = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;'

export const getChatHeaderDomFocusMode = (
  selectedSessionTitle: string,
  selectedProjectName: string,
  authEnabled = false,
  userState: AuthUserState = 'loggedOut',
  userName = '',
): readonly VirtualDomNode[] => {
  const items = [
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconAdd),
      name: InputName.FocusAddAction,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.addAction(),
    },
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconFolder),
      name: InputName.FocusOpenInVsCode,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.openInVsCode(),
    },
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconGitCommit),
      name: InputName.FocusCommit,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.commit(),
    },
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconTerminal),
      name: InputName.FocusOpenTerminal,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.openTerminal(),
    },
    {
      icon: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconDiff),
      name: InputName.FocusShowDiff,
      onClick: DomEventListenerFunctions.HandleClick,
      title: Strings.showDiff(),
    },
  ] as const
  const hasProjectName = !!selectedProjectName
  return [
    {
      childCount: 2 + (authEnabled ? 1 : 0),
      className: ClassNames.ChatFocusHeader,
      style: focusHeaderStyle,
      type: VirtualDomElements.Header,
    },
    ...getChatHeaderAuthDom(authEnabled, userState, userName),
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
    ...items.flatMap(getHeaderActionVirtualDom),
  ]
}

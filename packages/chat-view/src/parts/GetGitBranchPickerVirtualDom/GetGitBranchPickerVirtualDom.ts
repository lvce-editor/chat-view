import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { GitBranch } from '../GitBranch/GitBranch.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCustomSelectOptionVirtualDom } from '../GetCustomSelectOptionVirtualDom/GetCustomSelectOptionVirtualDom.ts'
import { getCustomSelectPickerToggleVirtualDom } from '../GetCustomSelectPickerToggleVirtualDom/GetCustomSelectPickerToggleVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

const itemHeight = 28
const messageHeight = 32

const getCurrentBranchLabel = (gitBranches: readonly GitBranch[], fallbackBranchName: string): string => {
  const currentBranch = gitBranches.find((branch) => branch.current)
  if (currentBranch) {
    return currentBranch.name
  }
  if (fallbackBranchName) {
    return fallbackBranchName
  }
  return 'Branch'
}

const getBranchOptionsVirtualDom = (gitBranches: readonly GitBranch[]): readonly VirtualDomNode[] => {
  return gitBranches.flatMap((branch) => {
    return getCustomSelectOptionVirtualDom(
      InputName.getGitBranchPickerItemInputName(branch.name),
      branch.name,
      branch.current,
      branch.current ? 'current' : '',
    )
  })
}

const getBranchPickerMessageDom = (gitBranches: readonly GitBranch[], errorMessage: string): readonly VirtualDomNode[] => {
  const message = errorMessage || (gitBranches.length === 0 ? 'No local git branches found.' : '')
  if (!message) {
    return []
  }
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatGitBranchPickerMessage, errorMessage ? ClassNames.ChatGitBranchPickerErrorMessage : ClassNames.Empty),
      type: VirtualDomElements.Div,
    },
    {
      text: message,
      type: VirtualDomElements.Text,
    },
  ]
}

export const getGitBranchPickerVirtualDom = (
  gitBranches: readonly GitBranch[],
  gitBranchPickerOpen: boolean,
  gitBranchPickerErrorMessage: string,
  fallbackBranchName: string,
): readonly VirtualDomNode[] => {
  const label = getCurrentBranchLabel(gitBranches, fallbackBranchName)
  const branchOptions = getBranchOptionsVirtualDom(gitBranches)
  const messageDom = getBranchPickerMessageDom(gitBranches, gitBranchPickerErrorMessage)
  const showMessage = messageDom.length > 0
  const popOverHeight = gitBranches.length * itemHeight + (showMessage ? messageHeight : 0)
  return [
    ...getCustomSelectPickerToggleVirtualDom(
      label,
      InputName.GitBranchPickerToggle,
      gitBranchPickerOpen,
      DomEventListenerFunctions.HandleClickGitBranchPickerToggle,
      'Switch branch',
      'Switch branch',
    ),
    ...(gitBranchPickerOpen
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatModelPickerContainer,
            onClick: DomEventListenerFunctions.HandleClickCustomSelectOverlay,
            type: VirtualDomElements.Div,
          },
          {
            childCount: (showMessage ? 1 : 0) + 1,
            className: mergeClassNames(ClassNames.ChatModelPicker, ClassNames.CustomSelectPopOver, ClassNames.ChatGitBranchPicker),
            style: `height: ${popOverHeight}px;`,
            type: VirtualDomElements.Div,
          },
          ...messageDom,
          {
            childCount: branchOptions.length / 4,
            className: ClassNames.ChatModelPickerList,
            role: 'listbox',
            type: VirtualDomElements.Ul,
          },
          ...branchOptions,
        ]
      : []),
  ]
}

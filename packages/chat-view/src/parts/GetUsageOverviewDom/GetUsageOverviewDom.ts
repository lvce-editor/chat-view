import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { clampToPercentage } from '../ClampToPercentage/ClampToPercentage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const tokenUsageOverviewNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.TokenUsageOverview,
  type: VirtualDomElements.Div,
}

const tokenUsageRingInnerNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.TokenUsageRingInner,
  style: 'background: var(--vscode-editor-background);',
  type: VirtualDomElements.Div,
}

export const getUsageOverviewDom = (tokensUsed: number, tokensMax: number): readonly VirtualDomNode[] => {
  const usagePercent = clampToPercentage(tokensUsed, tokensMax)
  const usageLabel = `${tokensUsed} / ${tokensMax}`
  const usageTitle = `${tokensUsed} of ${tokensMax} tokens used (${Math.round(usagePercent)}%)`
  return [
    tokenUsageOverviewNode,
    {
      childCount: 1,
      className: ClassNames.TokenUsageRing,
      style: `background: conic-gradient(var(--vscode-button-background) ${usagePercent}%, var(--vscode-editorWidget-border) 0);`,
      title: usageTitle,
      type: VirtualDomElements.Div,
    },
    tokenUsageRingInnerNode,
    {
      childCount: 1,
      className: ClassNames.LabelDetail,
      title: usageTitle,
      type: VirtualDomElements.Span,
    },
    text(usageLabel),
  ]
}

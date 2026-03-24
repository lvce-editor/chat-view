import * as DiffCss from '../DiffCss/DiffCss.ts'
import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffScrollTop from '../DiffScrollTop/DiffScrollTop.ts'
import * as DiffSelection from '../DiffSelection/DiffSelection.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as DiffValue from '../DiffValue/DiffValue.ts'

export const modules = [
  DiffItems.isEqual,
  DiffValue.diffValue,
  DiffSelection.diffSelection,
  DiffFocus.diffFocus,
  DiffCss.isEqual,
  DiffFocus.diffFocus,
  DiffScrollTop.diffScrollTop,
]

export const numbers = [
  DiffType.RenderIncremental,
  DiffType.RenderValue,
  DiffType.RenderSelection,
  DiffType.RenderFocus,
  DiffType.RenderCss,
  DiffType.RenderFocusContext,
  DiffType.RenderScrollTop,
]

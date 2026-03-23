import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as RenderCss from '../RenderCss/RenderCss.ts'
import * as RenderFocus from '../RenderFocus/RenderFocus.ts'
import { renderFocusContext } from '../RenderFocusContext/RenderFocusContext.ts'
import { renderIncremental as renderIncremental } from '../RenderIncremental/RenderIncremental.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'
import * as RenderScrollTop from '../RenderScrollTop/RenderScrollTop.ts'
import * as RenderValue from '../RenderValue/RenderValue.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderCss:
      return RenderCss.renderCss
    case DiffType.RenderFocus:
      return RenderFocus.renderFocus
    case DiffType.RenderFocusContext:
      return renderFocusContext
    case DiffType.RenderIncremental:
      return renderIncremental
    case DiffType.RenderItems:
      return RenderItems.renderItems
    case DiffType.RenderScrollTop:
      return RenderScrollTop.renderScrollTop
    case DiffType.RenderValue:
      return RenderValue.renderValue
    default:
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new Error('unknown renderer')
  }
}

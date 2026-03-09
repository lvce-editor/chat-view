import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getJsonTokenNodes } from '../GetJsonTokenNodes/GetJsonTokenNodes.ts'
import * as InputName from '../InputName/InputName.ts'

const getEventNode = (event: ChatViewEvent): readonly VirtualDomNode[] => {
  const tokenNodes = getJsonTokenNodes(event)
  return [
    {
      childCount: tokenNodes.length / 2,
      className: 'ChatDebugViewEvent',
      type: VirtualDomElements.Pre,
    },
    ...tokenNodes,
  ]
}

export const getChatDebugViewDom = (
  sessionId: string,
  errorMessage: string,
  filterValue: string,
  showInputEvents: boolean,
  showResponsePartEvents: boolean,
  events: readonly ChatViewEvent[],
): readonly VirtualDomNode[] => {
  if (errorMessage) {
    return [
      {
        childCount: 1,
        className: 'ChatDebugView',
        type: VirtualDomElements.Div,
      },
      {
        childCount: 1,
        className: 'ChatDebugViewError',
        type: VirtualDomElements.Div,
      },
      text(errorMessage),
    ]
  }

  const eventNodes = events.flatMap(getEventNode)
  const eventCountText = `${events.length} event${events.length === 1 ? '' : 's'}`
  return [
    {
      childCount: 4,
      className: 'ChatDebugView',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'ChatDebugViewTop',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'InputBox',
      name: InputName.Filter,
      onInput: DomEventListenerFunctions.HandleFilterInput,
      placeholder: 'Filter events',
      type: VirtualDomElements.Input,
      value: filterValue,
    },
    {
      childCount: 4,
      className: 'ChatDebugViewToggle',
      type: VirtualDomElements.Div,
    },
    {
      checked: showInputEvents,
      childCount: 0,
      inputType: 'checkbox',
      name: InputName.ShowInputEvents,
      onChange: DomEventListenerFunctions.HandleInput,
      type: VirtualDomElements.Input,
    },
    text('Show input events'),
    {
      checked: showResponsePartEvents,
      childCount: 0,
      inputType: 'checkbox',
      name: InputName.ShowResponsePartEvents,
      onChange: DomEventListenerFunctions.HandleInput,
      type: VirtualDomElements.Input,
    },
    text('Show response part events'),
    {
      childCount: 1,
      className: 'ChatDebugViewEventCount',
      type: VirtualDomElements.Div,
    },
    text(eventCountText),
    {
      childCount: 1,
      className: 'ChatDebugViewSession',
      type: VirtualDomElements.Div,
    },
    text(`sessionId: ${sessionId || '(none)'}`),
    {
      childCount: eventNodes.length === 0 ? 1 : eventNodes.length,
      className: 'ChatDebugViewEvents',
      type: VirtualDomElements.Div,
    },
    ...(eventNodes.length === 0
      ? [
          {
            childCount: 1,
            className: errorMessage ? 'ChatDebugViewError' : 'ChatDebugViewEmpty',
            type: VirtualDomElements.Div,
          },
          text(errorMessage || 'No events'),
        ]
      : eventNodes),
  ]
}

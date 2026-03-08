import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const getEventNode = (event: ChatViewEvent): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'ChatDebugViewEvent',
      type: VirtualDomElements.Pre,
    },
    text(JSON.stringify(event, null, 2)),
  ]
}

export const getChatDebugViewDom = (sessionId: string, filterValue: string, events: readonly ChatViewEvent[]): readonly VirtualDomNode[] => {
  const eventNodes = events.flatMap(getEventNode)
  return [
    {
      childCount: 3,
      className: 'ChatDebugView',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ChatDebugViewTop',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'InputBox',
      name: InputName.Filter,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: 'Filter events',
      type: VirtualDomElements.Input,
      value: filterValue,
    },
    {
      childCount: 1,
      className: 'ChatDebugViewSession',
      type: VirtualDomElements.Div,
    },
    text(`sessionId: ${sessionId || '(all)'}`),
    {
      childCount: eventNodes.length === 0 ? 1 : eventNodes.length,
      className: 'ChatDebugViewEvents',
      type: VirtualDomElements.Div,
    },
    ...(eventNodes.length === 0
      ? [
          {
            childCount: 1,
            className: 'ChatDebugViewEmpty',
            type: VirtualDomElements.Div,
          },
          text('No events'),
        ]
      : eventNodes),
  ]
}

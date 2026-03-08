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
  filterValue: string,
  showInputEvents: boolean,
  events: readonly ChatViewEvent[],
): readonly VirtualDomNode[] => {
  const eventNodes = events.flatMap(getEventNode)
  return [
    {
      childCount: 3,
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
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: 'Filter events',
      type: VirtualDomElements.Input,
      value: filterValue,
    },
    {
      childCount: 2,
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
            className: 'ChatDebugViewEmpty',
            type: VirtualDomElements.Div,
          },
          text('No events'),
        ]
      : eventNodes),
  ]
}

import { expect, test } from '@jest/globals'
import { AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../src/parts/ChatStrings/ChatStrings.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatListItemActionsDom } from '../src/parts/GetChatListItemActionsDom/GetChatListItemActionsDom.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

test('getChatListItemActionsDom returns delete action nodes for a session', () => {
  const session = {
    id: 'session-1',
    messages: [],
    title: 'Chat 1',
  }

  const result = getChatListItemActionsDom(session)

  expect(result).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatActions,
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.IconButton, ClassNames.SessionArchiveButton),
      'data-id': session.id,
      name: InputName.SessionDelete,
      onClick: DomEventListenerFunctions.HandleClickDelete,
      tabIndex: 0,
      title: Strings.deleteChatSession(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconArchive),
      type: VirtualDomElements.Div,
    },
  ])
})

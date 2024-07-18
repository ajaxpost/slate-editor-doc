import {
  EditorType,
  generateId,
  ShortcutCreateType,
  ShortcutElementType,
} from '@slate-doc/core';
import { Editor, Transforms, Element } from 'slate';

export function create(type: string) {
  return function (
    editor: EditorType,
    element: ShortcutElementType,
    { beforeText }: ShortcutCreateType
  ) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above(slate, {
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [, path] = match;
    if (path.length >= 2) {
      Transforms.wrapNodes(slate, {
        [type]: element.props,
        children: [{ text: '' }],
      });
      Transforms.setNodes(slate, {
        [type + '-item']: true,
      });
    } else {
      Transforms.wrapNodes(slate, {
        [type]: element.props,
        id: generateId(),
        children: [{ text: '' }],
      });
      Transforms.setNodes(slate, {
        [type + '-item']: true,
      });
      Transforms.unsetNodes(slate, 'id');
    }
  };
}

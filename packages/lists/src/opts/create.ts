import { EditorType, ShortcutElementType, generateId } from '@slate-doc/core';
import { Editor, Element, Transforms } from 'slate';

export function create(type: string) {
  return function (editor: EditorType, element: ShortcutElementType) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above(slate, {
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node, path] = match;
    const itemType = type.split('-')[0];
    console.log(path, 'path');

    if (path.length >= 2) {
      Transforms.wrapNodes(slate, {
        ...node,
        [type]: true,
      });
      Transforms.setNodes(slate, {
        [itemType + '-item']: {
          ...element.props,
        },
      });
    } else {
      Transforms.wrapNodes(slate, {
        [type]: true,
        id: generateId(),
        children: [{ text: '' }],
      });
      Transforms.setNodes(slate, {
        [itemType + '-item']: {
          ...element.props,
        },
      });
      Transforms.unsetNodes(slate, 'id');
    }
  };
}

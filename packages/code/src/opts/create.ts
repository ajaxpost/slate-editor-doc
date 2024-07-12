import {
  EditorType,
  generateId,
  ShortcutCreateType,
  ShortcutElementType,
} from '@slate-doc/core';
import { Editor, Element, Path, Transforms } from 'slate';

export function create(type: string) {
  return function (
    editor: EditorType,
    element: ShortcutElementType,
    { beforeText }: ShortcutCreateType
  ) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;

    Editor.withoutNormalizing(slate, () => {
      Transforms.setNodes(
        slate,
        {
          'code-item': true,
        },
        { match: (n) => Element.isElement(n) && Editor.isBlock(slate, n) }
      );
      Transforms.unsetNodes(slate, ['id', 'align', 'font-size']);

      Transforms.wrapNodes(slate, {
        [type]: {
          language: 'javascript',
        },
        id: generateId(),
        children: [{ text: '' }],
      });
    });
  };
}

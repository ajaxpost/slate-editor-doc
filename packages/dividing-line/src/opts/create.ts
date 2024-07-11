import {
  EditorType,
  generateId,
  ShortcutCreateType,
  ShortcutElementType,
} from '@slate-doc/core';
import { Transforms, Element, Editor } from 'slate';

export function create(type: string) {
  return function (
    editor: EditorType,
    element: ShortcutElementType,
    { beforeText }: ShortcutCreateType
  ) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;

    Transforms.setNodes(
      slate,
      {
        [type]: true,
      },
      { match: (n) => Element.isElement(n) && Editor.isBlock(slate, n) }
    );
    Transforms.insertNodes(slate, {
      id: generateId(),
      children: [{ text: '' }],
    });
  };
}

import {
  EditorType,
  ShortcutCreateType,
  ShortcutElementType,
} from '@slate-doc/core';
import { Editor, Element, Transforms } from 'slate';

export function create(type: string) {
  return function (
    editor: EditorType,
    element: ShortcutElementType,
    { beforeText }: ShortcutCreateType
  ) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const index = beforeText.lastIndexOf('#');

    Transforms.setNodes(
      slate,
      {
        [type]: {
          ...element.props,
          leval: index + 1,
        },
      },
      { match: (n) => Element.isElement(n) && Editor.isBlock(slate, n) }
    );
  };
}

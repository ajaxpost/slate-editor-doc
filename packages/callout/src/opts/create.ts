import {
  EditorType,
  generateId,
  ShortcutCreateType,
  ShortcutElementType,
} from '@slate-doc/core';
import { Transforms } from 'slate';

export function create(type: string) {
  return function (
    editor: EditorType,
    element: ShortcutElementType,
    { beforeText }: ShortcutCreateType
  ) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    Transforms.wrapNodes(slate, {
      [type]: element.props,
      id: generateId(),
      children: [{ text: '' }],
    });
    Transforms.setNodes(slate, {
      [type + '-item']: true,
    });
    Transforms.unsetNodes(slate, 'id');
  };
}

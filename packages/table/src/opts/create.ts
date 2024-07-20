import {
  EditorType,
  generateId,
  ShortcutCreateType,
  ShortcutElementType,
  SlateElement,
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
    const match = Editor.above<SlateElement>(slate, {
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
      mode: 'highest',
    });
    if (!match) return;
    const [node] = match;

    if (node[type] || node['table-row'] || node['table-cell']) return;
    const rowSize = (element.props?.rows || 2) as number;
    const colSize = (element.props?.cols || 2) as number;

    const children = Array.from({ length: rowSize }, () => {
      return {
        'table-row': true,
        children: Array.from({ length: colSize }, () => {
          return {
            'table-cell': true,
            cellId: generateId(),
            children: [
              {
                children: [{ text: '' }],
              },
            ],
          };
        }),
      };
    });

    Transforms.insertNodes(slate, {
      [type]: true,
      'table-cols-width': Array.from({ length: colSize }, () => 100),
      children,
      id: generateId(),
    });
  };
}

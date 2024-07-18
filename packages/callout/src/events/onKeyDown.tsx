import {
  EditorType,
  generateId,
  HOTKEYS_TYPE,
  SlateElement,
} from '@slate-doc/core';
import { Editor, Element, Transforms } from 'slate';

export function onKeyDown(editor: EditorType, hotkeys: HOTKEYS_TYPE) {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above<SlateElement>(slate, {
      at: slate.selection,
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node, path] = match;
    const parentMatch = Editor.parent(slate, path);
    if (!parentMatch) return;
    const [parentNode, parentPath] = parentMatch;

    if (event.isDefaultPrevented()) return;
    const filter = ['children', 'callout-item', 'align'];
    const keys = Object.keys(node).filter((o) => !filter.includes(o));
    if ((!parentNode['callout'] && !node['callout-item']) || keys.length)
      return;
    const text = Editor.string(slate, path);
    if (!text && (hotkeys.isBackspace(event) || hotkeys.isEnter(event))) {
      event.preventDefault();

      Transforms.unwrapNodes(slate, {
        split: true,
        match(n) {
          return (
            Element.isElement(n) && Editor.isBlock(slate, n) && !!n['callout']
          );
        },
      });
      Transforms.unsetNodes(slate, 'callout-item');
      if (parentPath.length < 2) {
        Transforms.setNodes(slate, {
          id: generateId(),
        });
      }

      return;
    }
    if (hotkeys.isEnter(event)) {
      event.preventDefault();

      Transforms.insertNodes(slate, {
        ...node,
        children: [{ ...node.children[0], text: '' }],
      });
    }
  };
}

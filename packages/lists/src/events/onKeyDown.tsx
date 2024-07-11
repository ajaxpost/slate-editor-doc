import { EditorType, generateId } from '@slate-doc/core';
import type { HOTKEYS_TYPE, SlateElement } from '@slate-doc/core';
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
    if (!node['bulleted-item'] && !node['bulleted-list']) return;
    if (event.isDefaultPrevented()) return;
    const text = Editor.string(slate, path);
    if (!text && (hotkeys.isBackspace(event) || hotkeys.isEnter(event))) {
      event.preventDefault();
      const item = node['bulleted-item'] as Record<string, unknown>;
      const leval = (item.leval || 0) as number;
      if (leval > 0) {
        Transforms.setNodes(slate, {
          'bulleted-item': {
            ...item,
            leval: leval - 1,
          },
        });
      } else {
        Transforms.unwrapNodes(slate, {
          split: true,
          match(n) {
            return (
              Element.isElement(n) &&
              Editor.isBlock(slate, n) &&
              !!n['bulleted-list']
            );
          },
        });
        Transforms.unsetNodes(slate, ['bulleted-item']);
        if (path.length < 3) {
          Transforms.setNodes(slate, {
            id: generateId(),
          });
        }
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

    if (hotkeys.isTab(event)) {
      event.preventDefault();
      const item = node['bulleted-item'] as Record<string, unknown>;
      const leval = (item.leval || 0) as number;
      Transforms.setNodes(slate, {
        'bulleted-item': {
          ...item,
          leval: leval + 1,
        },
      });
    }
  };
}

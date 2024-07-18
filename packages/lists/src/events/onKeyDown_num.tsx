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
    if (!node['numbered-item'] && !node['numbered-list']) return;
    if (event.isDefaultPrevented()) return;
    const text = Editor.string(slate, path);
    if (!text && (hotkeys.isBackspace(event) || hotkeys.isEnter(event))) {
      event.preventDefault();
      const item = node['numbered-item'] as Record<string, unknown>;
      const leval = (item.leval || 0) as number;

      if (leval > 0) {
        const pre = Editor.previous(slate, {
          match: (n) => {
            const nItem = n['numbered-item'] as Record<string, unknown>;
            return (
              Element.isElement(n) &&
              Editor.isBlock(slate, n) &&
              nItem &&
              nItem['leval'] === leval - 1
            );
          },
        });
        if (!pre) return;
        const [preNode] = pre;
        const nItem = preNode['numbered-item'] as Record<string, unknown>;

        Transforms.setNodes(slate, {
          'numbered-item': {
            ...item,
            leval: leval - 1,
            start: (nItem?.start as number) + 1,
          },
        });
      } else {
        Transforms.unwrapNodes(slate, {
          split: true,
          match(n) {
            return (
              Element.isElement(n) &&
              Editor.isBlock(slate, n) &&
              !!n['numbered-list']
            );
          },
        });
        Transforms.unsetNodes(slate, ['numbered-item']);
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
      const item = node['numbered-item'] as Record<string, unknown>;
      const start = item.start as number;
      Transforms.insertNodes(slate, {
        ...node,
        'numbered-item': {
          ...item,
          start: start + 1,
        },
        children: [{ ...node.children[0], text: '' }],
      });
    }

    if (hotkeys.isTab(event)) {
      event.preventDefault();
      const item = node['numbered-item'] as Record<string, unknown>;
      const leval = (item.leval || 0) as number;
      Transforms.setNodes(slate, {
        'numbered-item': {
          ...item,
          leval: leval + 1,
          start: 1,
        },
      });
    }
  };
}

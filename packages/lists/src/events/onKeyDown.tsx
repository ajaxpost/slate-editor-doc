// @ts-nocheck
import { EditorType, generateId } from '@slate-doc/core';
import type { HOTKEYS_TYPE } from '@slate-doc/core';
import { Editor, Transforms } from 'slate';

export function onKeyDown(editor: EditorType, hotkeys: HOTKEYS_TYPE) {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate) return;

    // @ts-ignore
    const [node] = Editor.above(slate, {
      at: slate.selection,
    });

    const types = ['bulleted-list', 'numbered-list'];

    if (types.includes(node.type)) {
      if (hotkeys.isEnter(event)) {
        event.preventDefault();

        if (!Editor.isEmpty(slate, node)) {
          Transforms.insertNodes(
            slate,
            {
              type: node.type,
              id: generateId(),
              props: {
                ...node.props,
                order: node.props.order + 1,
              },
              children: [{ text: '' }],
            },
            {
              select: true,
            }
          );
        } else {
          const depth = (node.props.depth || 0) as number;
          let props = {
            ...node.props,
          };
          if (depth > 0) {
            props.depth = depth - 1;
            // 获取上一个节点
            const [prevNode] = Editor.previous(slate, {
              at: slate.selection,
              match: (n) =>
                n.type === node.type && n.props.depth === props.depth,
            });
            props.order = prevNode ? prevNode.props.order + 1 : 0;
          } else {
            props = {};
          }

          Transforms.setNodes(slate, {
            type: depth === 0 ? 'paragraph' : node.type,
            props: props,
          });
        }
      }
      if (hotkeys.isTab(event)) {
        event.preventDefault();
        const props = {
          ...node.props,
        };
        props.depth = props.depth + 1;

        try {
          // 获取上一个节点
          const [prevNode] = Editor.previous(slate, {
            at: slate.selection,
            match: (n) => n.type === node.type && n.props.depth === props.depth,
          });
          props.order = prevNode ? prevNode.props.order + 1 : 0;
        } catch (error) {
          props.order = 0;
        }

        Transforms.setNodes(slate, {
          props: props,
        });
      }
    }
  };
}

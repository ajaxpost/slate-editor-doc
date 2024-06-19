import {
  Editor,
  Element,
  Path,
  Range,
  Text,
  TextUnit,
  Transforms,
} from 'slate';
import { EditorType } from '../preset/types';

export const withShortcuts = (editor: EditorType, slate: Editor) => {
  const { insertText, deleteBackward } = slate;
  editor.slate = slate;
  slate.insertText = (text: string) => {
    const { selection } = slate;

    // Range.isCollapsed => 如果选区是空的，返回 true
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;

      const blockEntry = Editor.above(slate, {
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
        mode: 'lowest', // mode: 'lowest' 的作用，它是一个遍历模式，有三个值：'lowest'、'highest'、'all'。'lowest' 表示从当前节点开始，向上遍历，直到找到第一个符合条件的节点；'highest' 表示从当前节点开始，向上遍历，直到找到最后一个符合条件的节点；'all' 表示从当前节点开始，向上遍历，找到所有符合条件的节点。
      });
      if (!blockEntry) return;
      const [, currentNodePath] = blockEntry;
      const parentEntry = Editor.parent(slate, currentNodePath);
      // 获取当前节点的父节点
      const [parentNodeElement] = parentEntry;

      if (
        Element.isElement(parentNodeElement) &&
        !Text.isText(parentNodeElement.children[0])
      ) {
        console.log('parent node is not text');

        return insertText(text);
      }

      const path = blockEntry ? currentNodePath : [];
      const start = Editor.start(slate, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(slate, range); // 获取光标前的文本

      const matchedBlock = editor.shortcuts?.[beforeText];
      const hasMatchedBlock = !!matchedBlock;

      if (hasMatchedBlock && !matchedBlock.isActive?.()) {
        Transforms.select(slate, range);
        Transforms.delete(slate);
        matchedBlock.create();

        return;
      }
    }

    insertText(text);
  };
  slate.deleteBackward = (unit: TextUnit) => {
    const { selection } = slate;
    if (!selection) return;

    const parentPath = Path.parent(selection.anchor.path);
    const isStart = Editor.isStart(slate, selection.anchor, parentPath);
    // 光标在当前节点的开始位置
    if (isStart) {
      const text = Editor.string(slate, parentPath);
      // @ts-ignore
      const [node] = Editor.above(slate, {
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
        mode: 'lowest',
      });

      if (text.trim().length === 0) {
        // 如果当前节点type是paragraph并且文本为空,删除当前节点
        if (node.type === 'paragraph') {
          Transforms.delete(slate, {
            at: parentPath,
          });
        } else {
          // 如果当前节点不是paragraph,就将当前节点的type改为paragraph
          Transforms.setNodes(slate, { type: 'paragraph' });
        }
      }
    } else {
      deleteBackward(unit);
    }
  };

  return slate;
};

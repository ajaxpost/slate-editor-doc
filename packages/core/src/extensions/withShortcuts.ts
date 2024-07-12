import { Editor, Element, Range, Transforms } from 'slate';
import { EditorType } from '../preset/types';
import { extra, singles, voids } from './config';

export const withShortcuts = (editor: EditorType, slate: Editor) => {
  const { insertText, isVoid } = slate;
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
      const [currentNode, currentNodePath] = blockEntry;

      const path = blockEntry ? currentNodePath : [];
      const start = Editor.start(slate, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(slate, range); // 获取光标前的文本

      const matchedBlock = editor.shortcuts?.[beforeText];

      const hasMatchedBlock = !!matchedBlock;
      const keys = Object.keys(currentNode).filter((o) => singles.includes(o));
      if (keys.length && hasMatchedBlock) {
        insertText(text);
        return;
      }
      if (
        Object.keys(currentNode).filter((o) =>
          matchedBlock?.options?.unEmbedList?.includes(o)
        ).length
      ) {
        insertText(text);
        return;
      }

      if (
        Object.keys(currentNode).filter((o) => !extra.includes(o)).length &&
        !matchedBlock?.options?.embedded
      ) {
        insertText(text);
        return;
      }
      if (hasMatchedBlock && !matchedBlock.isActive?.()) {
        Transforms.select(slate, range);
        Transforms.delete(slate);
        matchedBlock.create({
          beforeText,
        });

        return;
      }
    }

    insertText(text);
  };

  slate.isVoid = (element) => {
    for (const key of Object.keys(element)) {
      if (voids.includes(key)) return true;
    }
    return isVoid(element);
  };

  return slate;
};

import { Editor, TextUnit, Transforms } from 'slate';
import { generateId } from '../utils/generateId';
import { EditorType } from '../preset/types';

export const withPlaceholder = (editor: EditorType, slate: Editor) => {
  const { insertText, deleteBackward, deleteForward, deleteFragment } = slate;
  editor.slate = slate;

  // 输入文本时触发
  slate.insertText = (text: string) => {
    const { selection } = slate;

    if (selection) {
      // @ts-ignore
      const [node] = Editor.above(slate, {
        at: selection,
        // @ts-ignore
        match: (n) => Editor.isBlock(slate, n),
      });

      const type = node.type;

      if (type === 'placeholder') {
        Transforms.setNodes(slate, { type: 'paragraph', id: generateId() });
      }
    }

    insertText(text);
  };

  // 按backspace键时触发,删除前面内容
  slate.deleteBackward = (unit: TextUnit) => {
    const { selection } = slate;
    if (selection) {
      deleteBackward(unit);

      const [node] = Editor.above(slate);

      if (Editor.isEmpty(slate, node)) {
        Transforms.setNodes(slate, {
          type: 'placeholder',
          props: { placeholder: editor.placeholder || '请输入内容' },
        });
      }
    }
  };
  // 按delete键时触发,删除后面内容
  slate.deleteForward = (unit: TextUnit) => {
    const { selection } = slate;
    if (selection) {
      deleteForward(unit);

      const [node] = Editor.above(slate);

      if (Editor.isEmpty(slate, node)) {
        Transforms.setNodes(slate, {
          type: 'placeholder',
          props: { placeholder: editor.placeholder || '请输入内容' },
        });
      }
    }
  };

  // 删除选中的内容
  slate.deleteFragment = () => {
    const { selection } = slate;
    if (selection) {
      deleteFragment();
      const [node] = Editor.above(slate);

      if (Editor.isEmpty(slate, node)) {
        Transforms.setNodes(slate, {
          type: 'placeholder',
          props: { placeholder: editor.placeholder || '请输入内容' },
        });
      }
    }
  };

  return slate;
};

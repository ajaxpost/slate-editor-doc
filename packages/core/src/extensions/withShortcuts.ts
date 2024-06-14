import { Editor, Element, Range } from 'slate';

export const withShortcuts = (slate: Editor) => {
  const { insertText } = slate;
  slate.insertText = (text: string) => {
    const { selection } = slate;

    // Range.isCollapsed => 如果选区是空的，返回 true
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const blockEntry = Editor.above(slate, {
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
        mode: 'lowest',
      });
      console.log(blockEntry, 'blockEntry');
    }

    insertText(text);
  };

  return slate;
};

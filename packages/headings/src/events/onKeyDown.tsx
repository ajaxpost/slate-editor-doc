import { EditorType, HOTKEYS_TYPE, SlateElement } from "@slate-doc/core";
import { Editor, Element } from "slate";

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
    if (!node) return;
    const types = [
      "heading-one",
      "heading-two",
      "heading-three",
      "heading-four",
      "heading-five",
      "heading-six",
    ];
    if (!types.includes(node.type)) return;
    const isEnd = Editor.isEnd(slate, slate.selection.anchor, path);

    if (hotkeys.isEnter(event) && isEnd) {
      // 判断是否是被wrap了
      // event.preventDefault();
      // console.log("heading enter end");
    }
  };
}

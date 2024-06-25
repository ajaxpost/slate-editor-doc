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
    const [node] = match;
    if (node.type === "blockquote") {
      if (hotkeys.isEnter(event)) {
        event.preventDefault();
        Editor.withoutNormalizing(slate, () => {
          Editor.insertBreak(slate);
        });
      }
    }
  };
}

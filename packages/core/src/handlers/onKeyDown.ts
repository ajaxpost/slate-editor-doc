import { EditorType } from "../preset/types";
import { generateId } from "../utils/generateId";
import { HOTKEYS } from "../utils/hotkeys";
import { Path, Editor, Transforms, Node } from "slate";

export const onKeyDown = (editor: EditorType) => {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;

    if (!slate || !slate.selection) return;
    const parentPath = Path.parent(slate.selection.anchor.path);

    // 回车
    if (HOTKEYS.isEnter(event)) {
      // 判断事件的默认执行是否已经被阻止,如果已经被阻止返回true
      if (event.isDefaultPrevented()) return;

      const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);
      const isEnd = Editor.isEnd(slate, slate.selection.anchor, parentPath);

      if (isStart || isEnd) {
        event.preventDefault();
        const defaultBlock: Node = {
          type: "paragraph",
          id: generateId(),
          children: [{ text: "" }],
          props: {},
        };

        // 获取所有nodes
        // Editor.nodes(slate, {
        //   at: Editor.range(slate, []),
        // })

        // 相比较 Editor.insertNode 这个更加灵活,可以在特定位置插入,就是可以传入at坐标
        Transforms.insertNodes(slate, defaultBlock, {
          at: slate.selection,
          select: true,
        });
      }
    }
  };
};

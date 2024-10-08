import { EditorType, SlateElement } from '../preset/types';
import isHotkey from 'is-hotkey';
import { HOTKEYS } from '../utils/hotkeys';
import { Editor, Transforms, Element, Path } from 'slate';
import { generateId } from '../utils/generateId';
import { extra, singles } from '../extensions/config';

export const onKeyDown = (editor: EditorType) => {
  return (event: React.KeyboardEvent) => {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const marks = editor.marks;
    for (const [, value] of Object.entries(marks)) {
      const hotkey = value.options?.hotkey;
      if (hotkey && isHotkey(hotkey, event)) {
        event.preventDefault();
        value.options?.create?.(editor);
      }
    }
    const plugins = editor.plugins;
    for (const [, value] of Object.entries(plugins)) {
      const hotkey = value.options?.hotkey;
      if (hotkey && isHotkey(hotkey, event)) {
        event.preventDefault();
        value.options?.create?.(
          editor,
          {
            props: value.elements.props,
          },
          {
            beforeText: value.options?.shortcuts?.[0] || '',
          }
        );
      }
    }
    if (HOTKEYS.isCtrlEnter(event)) {
      event.preventDefault();
      const match = Editor.above(slate, {
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
        mode: 'highest',
      });
      if (!match) return;
      const [, path] = match;
      Transforms.insertNodes(
        slate,
        {
          id: generateId(),
          children: [{ text: '' }],
        },
        {
          at: Path.next(path),
          select: true,
        }
      );
    }
  };
};
// 确保菜单项可见的函数
function ensureVisible(key: string) {
  const element = document.querySelector(`[data-key="${key}"]`);
  if (element) {
    element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}
// 按下 / 时 触发
export const slashOnKeyDown = (editorState: EditorType, props) => {
  const {
    menuShow,
    menuActiveKey,
    setMenuActiveKey,
    setMenuShow,
    setMenuPosition,
    actions,
  } = props;
  return (event: React.KeyboardEvent) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above<SlateElement>(slate, {
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node] = match;

    if (menuShow) {
      if (HOTKEYS.isArrowDown(event) || HOTKEYS.isArrowUp(event)) {
        event.preventDefault();
        const findIndex = actions.findIndex((x) => x.key === menuActiveKey);
        if (HOTKEYS.isArrowDown(event)) {
          if (findIndex === actions.length - 1) {
            setMenuActiveKey(actions[0].key);
            ensureVisible(actions[0].key);
            return;
          }

          const next = actions[findIndex + 1];
          if (next) {
            setMenuActiveKey(next.key);
            ensureVisible(next.key);
          }
        } else if (HOTKEYS.isArrowUp(event)) {
          if (findIndex === 0) {
            setMenuActiveKey(actions[actions.length - 1].key);
            ensureVisible(actions[actions.length - 1].key);
            return;
          }
          const prev = actions[findIndex - 1];

          if (prev) {
            setMenuActiveKey(prev.key);
            ensureVisible(prev.key);
          }
        }
      } else if (HOTKEYS.isEnter(event)) {
        const find = actions.find((x) => x.key === menuActiveKey);

        if (find) {
          event.preventDefault();

          const type = find.key.split('_')[0];
          const beforeText = find.key.split('_')[1];
          const plugin = editorState.plugins[type];

          const start = Editor.start(slate, slate.selection?.anchor.path!);

          const range = { anchor: slate.selection.anchor, focus: start };
          Transforms.select(slate, range);
          Transforms.delete(slate);
          // start --
          const match = Editor.above<SlateElement>(slate, {
            at: slate.selection,
            match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
          });
          if (!match) return;
          const [currentNode] = match;
          const keys = Object.keys(currentNode).filter((o) =>
            singles.includes(o)
          );
          if (keys.length) {
            setMenuShow(false);
            return;
          }
          if (
            Object.keys(currentNode).filter((o) => !extra.includes(o)).length &&
            !plugin.options?.embedded
          ) {
            setMenuShow(false);
            return;
          }
          if (
            Object.keys(currentNode).filter((o) =>
              plugin?.options?.unEmbedList?.includes(o)
            ).length
          ) {
            setMenuShow(false);
            return;
          }

          // end --
          plugin?.options?.create?.(editorState, plugin.elements, {
            beforeText,
          });

          setMenuShow(false);
        }
      }
    }

    if (
      HOTKEYS.isSlash(event) &&
      Object.keys(node).filter((o) => singles.includes(o)).length === 0
    ) {
      const isEmpty = Editor.isEmpty(slate, node);

      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0 && isEmpty) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setMenuShow(true);
      }
    }
  };
};

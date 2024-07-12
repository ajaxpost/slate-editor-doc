import { EditorType, SlateElement } from '../preset/types';
import isHotkey from 'is-hotkey';
import { HOTKEYS } from '../utils/hotkeys';
import { menuConfig } from '../components/ActionMenu/config';
import { Editor, Transforms, Element, Path } from 'slate';
import { generateId } from '../utils/generateId';

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

// 按下 / 时 触发
export const slashOnKeyDown = (editorState: EditorType, props) => {
  const {
    menuShow,
    menuActiveKey,
    setMenuActiveKey,
    setMenuShow,
    setMenuPosition,
  } = props;

  return (event: React.KeyboardEvent) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    const match = Editor.above<SlateElement>(slate, {
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node] = match;
    if (node['code'] || node['code-item']) return;

    if (menuShow) {
      if (HOTKEYS.isArrowDown(event) || HOTKEYS.isArrowUp(event)) {
        event.preventDefault();
        const findIndex = menuConfig.findIndex((x) => x.key === menuActiveKey);
        if (HOTKEYS.isArrowDown(event)) {
          const next = menuConfig[findIndex + 1];
          next && setMenuActiveKey(next.key);
        } else if (HOTKEYS.isArrowUp(event)) {
          const prev = menuConfig[findIndex - 1];
          prev && setMenuActiveKey(prev.key);
        }
      } else if (HOTKEYS.isEnter(event)) {
        const find = menuConfig.find((x) => x.key === menuActiveKey);
        if (find) {
          event.preventDefault();

          const type = find.key.split('_')[0];
          const beforeText = find.key.split('_')[1];
          const plugin = editorState.plugins[type];

          const start = Editor.start(slate, slate.selection?.anchor.path!);

          const range = { anchor: slate.selection.anchor, focus: start };
          const text = Editor.string(slate, range);
          if (text === '/') {
            Transforms.select(slate, range);
            Transforms.delete(slate);
          }

          plugin?.options?.create?.(editorState, plugin.elements, {
            beforeText,
          });

          setMenuShow(false);
        }
      } else {
        setMenuShow(false);
      }
    }

    if (HOTKEYS.isSlash(event)) {
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

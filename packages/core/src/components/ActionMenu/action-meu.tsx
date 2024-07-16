import { FC, MouseEvent } from 'react';
import { css } from '@emotion/css';
import { useSlashState } from '../../context/slash-context';
import { useEditorState } from '../../context/editor-context';
import { Editor, Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import { SlateElement } from '../../preset/types';
import { extra, singles } from '../../extensions/config';

const ActionMenu: FC = () => {
  const editorState = useEditorState();
  const {
    menuPosition,
    menuActiveKey,
    setMenuActiveKey,
    setMenuShow,
    actions,
  } = useSlashState();

  const handlerClick = (e: MouseEvent<HTMLButtonElement>, item) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    e.preventDefault();
    e.stopPropagation();

    const type = item.key.split('_')[0];
    const beforeText = item.key.split('_')[1];
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
    const keys = Object.keys(currentNode).filter((o) => singles.includes(o));
    if (keys.length) {
      ReactEditor.focus(slate);
      setMenuShow(false);
      return;
    }
    if (
      Object.keys(currentNode).filter((o) => !extra.includes(o)).length &&
      !plugin.options?.embedded
    ) {
      ReactEditor.focus(slate);
      setMenuShow(false);
      return;
    }
    if (
      Object.keys(currentNode).filter((o) =>
        plugin?.options?.unEmbedList?.includes(o)
      ).length
    ) {
      ReactEditor.focus(slate);
      setMenuShow(false);
      return;
    }

    // end --

    plugin?.options?.create?.(editorState, plugin.elements, {
      beforeText,
    });
    ReactEditor.focus(slate);
    setMenuShow(false);
  };

  return (
    <div>
      <div
        className={css`
          position: absolute;
          left: 0px;
          top: 0px;
          transition-property: opacity;
          transform: translate(
            ${menuPosition.left}px,
            ${menuPosition.top + 40}px
          );
          transition-duration: 100ms;
          z-index: 9999;
        `}
      >
        <div
          style={{
            maxWidth: 270,
          }}
          className={css`
            background-color: #fff;
            border-color: rgb(229, 231, 235);
            border-radius: 0.375rem;
            border-style: solid;
            border-width: 1px;
            box-shadow:
              0 0 #0000,
              0 0 #0000,
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1);
            height: auto;
            max-height: 330px;
            overflow-y: auto;
            padding: 0.5rem 0.25rem;
            transition-duration: 0.15s;
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            width: 18rem;
          `}
        >
          <div
            className={css`
              max-height: 300px;
              overflow-y: auto;
              overflow-x: hidden;
            `}
          >
            <div
              className={css`
                overflow: hidden;
                padding: 0;
              `}
            >
              {actions.length ? (
                actions.map((item) => {
                  return (
                    <button
                      data-key={item.key}
                      onMouseEnter={() => setMenuActiveKey(item.key)}
                      key={item.key}
                      onClick={(e) => handlerClick(e, item)}
                      className={css`
                        background-color: transparent;
                        border-style: none;
                        cursor: pointer;
                        margin-bottom: 0.125rem;
                        display: flex;
                        width: 100%;
                        align-items: center;
                        border-radius: 0.375rem;
                        padding-left: 0.25rem;
                        padding-right: 0.25rem;
                        padding-bottom: 0.25rem;
                        padding-top: 0.25rem;
                        text-align: left;
                        font-size: 0.875rem;
                        line-height: 1.25rem;
                        background: ${menuActiveKey === item.key
                          ? '#f3f4f6'
                          : 'transparent'};
                      `}
                    >
                      {/* icon */}
                      <div
                        style={{
                          minWidth: 40,
                          width: 40,
                          height: 40,
                        }}
                        className={css`
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          border-radius: 0.375rem;
                          border-width: 1px;
                          border-style: solid;
                          border-color: #e5e7eb;
                          background-color: #fff;
                        `}
                      >
                        {item.icon}
                      </div>
                      {/* text */}
                      <div
                        className={css`
                          margin-left: 0.5rem;
                          flex: auto;
                        `}
                      >
                        <div
                          className={css`
                            font-weight: 500;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          `}
                        >
                          <span>{item.title}</span>
                          <span
                            className={css`
                              color: #6b7280;
                            `}
                          >
                            {item.search}
                          </span>
                        </div>
                        <div
                          className={css`
                            max-width: 200px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: 0.75rem;
                            line-height: 1rem;
                          `}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div
                  className={css`
                    padding: 10px 15px;
                    font-size: 14px;
                  `}
                >
                  暂无匹配的搜索结果
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;

import { FC, MouseEvent } from 'react';
import { css } from '@emotion/css';
import { menuConfig } from './config';
import { useSlashState } from '../../context/slash-context';
import { useEditorState } from '../../context/editor-context';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

const ActionMenu: FC = () => {
  const editorState = useEditorState();
  const { menuPosition, menuActiveKey, setMenuActiveKey, setMenuShow } =
    useSlashState();

  const handlerClick = (e: MouseEvent<HTMLButtonElement>, item) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    e.preventDefault();
    e.stopPropagation();

    const type = item.key.split('-')[0];
    const beforeText = item.key.split('-')[1];
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
              {menuConfig.map((item) => {
                return (
                  <button
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
                      `}
                    >
                      <div
                        className={css`
                          font-weight: 500;
                        `}
                      >
                        {item.title}
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
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;

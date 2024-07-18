import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Descendant, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable as _Editable, Slate, withReact } from 'slate-react';
import { useEditorState, useReadOnly } from '../context/editor-context';
import { css } from '@emotion/css';
import { generateId } from '../utils/generateId';
import { withShortcuts } from '../extensions/withShortcuts';
import { EVENT_HANDLERS } from '../handlers';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { withNodeId } from '../extensions/withNodeId';
import './editable.css';
import { HOTKEYS } from '../utils/hotkeys';
import _ from 'lodash';
import { EditorPlugin } from '../plugins/createEditorPlugin';
import Toolbar from '../components/Toolbar/toolbar';
import {
  ToolbarProvider,
  ToolbarContextType,
} from '../context/toolbar-context';
import ActionMenu from '../components/ActionMenu/action-meu';
import { SlashProvider } from '../context/slash-context';
import { ConfigProvider } from 'antd';
import { menuConfig } from '../components/ActionMenu/config';

type IProps = {
  width?: number;
  style?: React.CSSProperties;
  className?: string;
  value?: Descendant[];
};
export const Editable: FC<IProps> = ({ width, style, className, value }) => {
  const editorState = useEditorState();
  const readOnly = useReadOnly();
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [menuActiveKey, setMenuActiveKey] = useState('heading-#');
  const [menuShow, setMenuShow] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [actions, setActions] = useState(menuConfig);
  const editor = useMemo(
    () =>
      withShortcuts(
        editorState,
        withNodeId(withReact(withHistory(createEditor())))
      ),
    []
  );
  const [toolbarState, setToolbarState] = useState<ToolbarContextType>(() => {
    return {
      textAndTitle: '',
      fontSize: {
        size: '',
        disabled: false,
      },
    };
  });

  useEffect(() => {
    const click = () => {
      setMenuShow(false);
    };
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('click', click);
    };
  }, []);

  const handlerChange = useCallback(
    _.debounce((value) => {
      console.log('Slate Value', value);
    }, 500),
    []
  );

  const onChange = (value) => {
    handlerChange(value);
    EVENT_HANDLERS.onChange(editorState, setToolbarState)(value);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    EVENT_HANDLERS.onKeyUp(editorState, {
      setMenuActiveKey,
      menuActiveKey,
      setMenuShow,
      menuShow,
      setMenuPosition,
      actions,
      setActions,
    })(event);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const events: any[] = [];

    for (const name in editorState.plugins) {
      const plugin = editorState.plugins[name];
      const plugin_events = plugin?.events || {};
      if (plugin_events.onKeyDown) {
        events.push(plugin_events.onKeyDown);
      }
    }
    for (const name in editorState.marks) {
      const mark = editorState.marks[name];
      const mark_events = mark?.events || {};
      if (mark_events.onKeyDown) {
        events.push(mark_events.onKeyDown);
      }
    }
    EVENT_HANDLERS.slashOnKeyDown(editorState, {
      setMenuActiveKey,
      menuActiveKey,
      setMenuShow,
      menuShow,
      setMenuPosition,
      actions,
      setActions,
    })(event);
    for (const e of _.uniq(events)) {
      e(editorState, HOTKEYS)(event);
    }
    EVENT_HANDLERS.onKeyDown(editorState)(event);
  };
  const items = useMemo(
    // @ts-ignore
    () => editor.children.map((element) => element.id),
    [editor.children]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active) {
      setActiveId(event.active.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id;
    // @ts-ignore
    const overIndex = editor.children.findIndex((x) => x.id === overId);
    if (overId !== activeId && overIndex !== -1) {
      Transforms.moveNodes(editor, {
        at: [],
        match: (node: any) => node.id === activeId,
        to: [overIndex],
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const { renderElement, renderLeaf, decorate } = useMemo(
    () => EditorPlugin.start(editorState, items),
    [editorState, items]
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
        },
      }}
    >
      <ToolbarProvider value={toolbarState}>
        <Toolbar editorState={editorState} />
        <div
          className={css`
            padding-top: 42px;
          `}
        >
          <SlashProvider
            value={{
              menuPosition,
              setMenuPosition,
              menuShow,
              setMenuShow,
              menuActiveKey,
              setMenuActiveKey,
              actions,
              setActions,
            }}
          >
            <Slate
              editor={editor}
              onChange={onChange}
              initialValue={
                value || [
                  {
                    children: [{ text: '' }],
                    id: generateId(),
                  },
                ]
              }
            >
              <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={items}>
                  <_Editable
                    autoFocus
                    className={css`
                      width: ${width ? `${width}px` : '100%'};
                      padding-left: 2rem;
                      padding-right: 2rem;
                      padding-bottom: 20vh;
                      padding-top: 1rem;
                      font-size: 1rem;
                      line-height: 1.5rem;
                      outline: none;
                      height: 100%;
                      ${className}
                    `}
                    id="editable"
                    spellCheck
                    readOnly={readOnly}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    decorate={decorate}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    style={style}
                  />
                </SortableContext>
              </DndContext>
              {menuShow && <ActionMenu />}
            </Slate>
          </SlashProvider>
        </div>
      </ToolbarProvider>
    </ConfigProvider>
  );
};

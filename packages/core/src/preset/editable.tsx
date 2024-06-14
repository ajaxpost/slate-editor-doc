import { FC, useMemo, useState } from 'react';
import { Descendant, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable as _Editable,
  RenderElementProps,
  Slate,
  withReact,
} from 'slate-react';
import { useEditorState } from '../context/editor-context';
import DefaultElement from '../components/Editor/DefaultElement';
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
import { withPlaceholder } from '../extensions/withPlaceholder';
import SortableElement from '../components/Editor/SortableElement';
import DefaultPlaceholder from '../components/Editor/DefaultPlaceholder';
import './editable.css';
import { EditorType } from './types';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
    id: generateId(),
  },
];

type IProps = {
  width: number | string;
};

const renderElementContent = (props: RenderElementProps) => {
  return <DefaultElement {...props} />;
};

const getMappedElements = (plugins: EditorType['plugins']) => {
  const map: Record<string, unknown> = {};
  for (const [, value] of Object.entries(plugins)) {
    const type = Object.keys(value.elements)[0];
    map[type] = value.elements[type].render;
  }
  return map;
};

export const Editable: FC<IProps> = ({ width }) => {
  const editorState = useEditorState();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const editor = useMemo(
    () =>
      withPlaceholder(
        editorState,
        withShortcuts(withNodeId(withReact(withHistory(createEditor()))))
      ),
    []
  );
  const ELEMENTS_MAP = useMemo(
    () => getMappedElements(editorState.plugins),
    [editorState]
  );

  const renderElement = (props: RenderElementProps) => {
    if (props.element.type === 'placeholder') {
      return <DefaultPlaceholder {...props} />;
    }
    return <SortableElement {...props} renderElement={renderElementContent} />;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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

  const onSelect = (e: React.SyntheticEvent<HTMLDivElement, Event>) =>
    EVENT_HANDLERS.onSelect(e, editor);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items}>
          <_Editable
            className={css`
              padding-left: 2rem;
              padding-right: 2rem;
              padding-bottom: 20vh;
              padding-top: 1rem;
              font-size: 1rem;
              line-height: 1.5rem;
              outline: none;
            `}
            id="editable"
            spellCheck
            onSelect={onSelect}
            readOnly={false}
            renderElement={renderElement}
            onKeyDown={onKeyDown}
          />
        </SortableContext>
      </DndContext>
    </Slate>

    // <div
    //   data-editor-id={editor.id}
    //   className={clsx('editor', className)}
    //   style={editorStyles}
    // >
    //   {/* Blocks 最外层 */}
    //   <RenderBlocks editor={editor} />
    // </div>
  );
};

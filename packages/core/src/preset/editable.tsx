import { FC, useMemo, useState } from 'react';
import { Descendant, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable as _Editable,
  RenderElementProps,
  RenderLeafProps,
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
import SortableElement from '../components/Editor/SortableElement';
import './editable.css';
import { EditorType } from './types';
import TextLeaf from '../components/TextLeaf/TextLeaf';

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
const renderElementContent = (
  ElementComponent: React.ElementType | undefined,
  props: RenderElementProps
) => {
  if (!ElementComponent) {
    return <DefaultElement {...props} />;
  }

  return <ElementComponent {...props} />;
};

const getMappedElements = (plugins: EditorType['plugins']) => {
  const map: Record<
    string,
    ((props: RenderElementProps) => JSX.Element) | undefined
  > = {};
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
      withShortcuts(
        editorState,
        withNodeId(withReact(withHistory(createEditor())))
      ),
    []
  );
  const ELEMENTS_MAP = useMemo(
    () => getMappedElements(editorState.plugins),
    [editorState]
  );

  const renderElement = (props: RenderElementProps) => {
    const ElementComponent: React.ElementType | undefined =
      ELEMENTS_MAP[props.element.type];

    return (
      <SortableElement
        {...props}
        renderElement={() => renderElementContent(ElementComponent, props)}
      />
    );
  };

  const renderLeaf = (props: RenderLeafProps) => {
    const showPlaceholder = props.leaf.text === '';

    return (
      <TextLeaf
        attributes={props.attributes}
        placeholder={showPlaceholder ? editorState.placeholder : undefined}
      >
        {props.children}
      </TextLeaf>
    );
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
            readOnly={false}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
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

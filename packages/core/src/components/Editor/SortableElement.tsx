import { FC, MouseEvent, ReactNode, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { RenderElementProps } from 'slate-react';
import { useEditorState, useReadOnly } from '../../context/editor-context';
import { css } from '@emotion/css';
import clsx from 'clsx';
import { Editor, Transforms, Element, Path } from 'slate';
import { generateId } from '../../utils/generateId';
import { useSlashState } from '../../context/slash-context';
import { SlateElement } from '../../preset/types';

type IProps = {
  renderElement: (props: any) => JSX.Element;
  items: string[];
  style: React.CSSProperties;
} & RenderElementProps;

type SortableProps = {
  sortable: any;
  children: ReactNode;
};
export const toPx = (value: number) =>
  value ? `${Math.round(value)}px` : undefined;

const Sortable: FC<SortableProps> = ({ sortable, children }) => {
  return (
    <div
      className="sortable"
      {...sortable.attributes}
      ref={sortable.setNodeRef}
      style={{
        transition: sortable.transition,
        // '--translate-y': toPx(sortable.transform?.y),
        pointerEvents: sortable.isSorting ? 'none' : undefined,
        opacity: sortable.isDragging ? 0.5 : 1,
      }}
    >
      {children}
    </div>
  );
};

const SortableElement: FC<IProps> = ({
  renderElement,
  attributes,
  element,
  children,
  items,
  style,
}) => {
  const editorState = useEditorState();
  const slash = useSlashState();
  const readOnly = useReadOnly();
  const sortable = useSortable({ id: element.id || '' });
  const { isDragging, isOver, over, active } = sortable;
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [position, setPosition] = useState('');

  useEffect(() => {
    if (!isDragging && active && over) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      if (oldIndex !== newIndex) {
        if (newIndex > oldIndex) {
          setPosition('down');
        } else {
          setPosition('up');
        }
      }
    }
  }, [items, isDragging, active, over]);

  const handleMouseEnter = () => {
    if (readOnly) return;
    setActiveBlockId(element.id || '');
  };
  const handleMouseLeave = () => {
    if (readOnly) return;
    setActiveBlockId(null);
  };

  const isHovered = (activeBlockId === element.id || isDragging) && !readOnly;

  if (!element.id) {
    return (
      <div
        {...attributes}
        className={css`
          position: relative;
        `}
        style={style}
      >
        {renderElement({ element, children })}
      </div>
    );
  }

  const add = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const slate = editorState.slate;
    if (!slate || !slate?.selection) return;
    const { setMenuPosition, setMenuShow } = slash;
    const findIndex = slate.children.findIndex((o: any) => o.id === element.id);

    const nextPath = findIndex + 1;

    // 在下一行插入一个空行
    Transforms.insertNodes(
      slate,
      {
        children: [{ text: '/' }],
        id: generateId(),
      },
      {
        at: [nextPath],
        select: true,
      }
    );
    setTimeout(() => {
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setMenuShow(true);
      }
    }, 0);
  };

  return (
    <div
      {...attributes}
      data-id={element.id}
      data-hovered={isHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx({
        'editor-block-up': position === 'up' && !isDragging && isOver,
        'editor-block-down': position === 'down' && !isDragging && isOver,
      })}
      style={style}
    >
      <Sortable sortable={sortable}>
        <div
          className={css`
            display: flex;
            height: 24px;
            opacity: ${!isHovered ? 0 : 1};
            transition-duration: 0.15s;
            margin-right: 8px;
            transition-property: opacity;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            position: absolute;
            left: -60px;
          `}
          contentEditable={false}
        >
          <button
            className={css`
              cursor: pointer;
              &:hover {
                background: #37362f14;
              }
              justify-content: center;
              align-items: center;
            `}
            contentEditable={false}
            onClick={add}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className={css`
                width: 16px;
                height: 16px;
                display: block;
                flex-shrink: 0;
                backface-visibility: hidden;
              `}
            >
              <path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 0 0-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 0 0-.739.722v5.529h-5.37a.746.746 0 0 0-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path>
            </svg>
          </button>
          <button
            className={css`
              cursor: pointer;
              &:hover {
                background: #37362f14;
              }
            `}
            onMouseEnter={() => {
              setHoverBtn(true);
            }}
            onMouseLeave={() => {
              setHoverBtn(false);
            }}
            contentEditable={false}
            {...sortable.listeners}
          >
            ⠿
          </button>
        </div>
        <div
          className={css`
            flex: 1;
            background: ${hoverBtn ? '#f0f7fe' : 'transparent'};
          `}
        >
          {renderElement({ element, children })}
        </div>
      </Sortable>
    </div>
  );
};
export default SortableElement;

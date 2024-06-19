import { FC, ReactNode, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { RenderElementProps } from 'slate-react';
import { useReadOnly } from '../../context/editor-context';
import { css } from '@emotion/css';

type IProps = {
  renderElement: (props: any) => JSX.Element;
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
        '--translate-y': toPx(sortable.transform?.y),
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
}) => {
  const readOnly = useReadOnly();
  const sortable = useSortable({ id: element.id || '' });
  const { isDragging, isOver } = sortable;
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (readOnly) return;
    setActiveBlockId(element.id || '');
  };
  const handleMouseLeave = () => {
    if (readOnly) return;
    setActiveBlockId(null);
  };

  const isHovered = (activeBlockId === element.id || isDragging) && !readOnly;

  return (
    <div
      {...attributes}
      data-id={element.id}
      data-hovered={isHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderBottom:
          isOver && !isDragging ? '2px solid rgb(0,122,255)' : 'none',
      }}
    >
      <Sortable sortable={sortable}>
        <div
          className={css`
            display: flex;
            opacity: ${!isHovered ? 0 : 1};
            transition-duration: 0.15s;
            margin-right: 8px;
            transition-property: opacity;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          `}
          contentEditable={false}
        >
          <button
            className={css`
              cursor: pointer;
              &:hover {
                background: #37362f14;
              }
            `}
            contentEditable={false}
            {...sortable.listeners}
          >
            ⠿
          </button>
        </div>
        <div>{renderElement({ element, children })}</div>
      </Sortable>
    </div>
  );
};
export default SortableElement;

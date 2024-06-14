import { FC, useMemo } from 'react';
import { EditorType } from '../../preset/types';
import Block from '../Block/Block';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEditorDragDrop } from './dnd';

type IProps = {
  editor: EditorType;
  placeholder?: string;
};

const RenderBlocks: FC<IProps> = ({ editor }) => {
  const { sensors, handleDragStart, handleDragEnd } = useEditorDragDrop({
    editor,
  });

  const childrenUnorderedKeys = Object.keys(editor.children);
  const childrenKeys = useMemo(() => {
    if (childrenUnorderedKeys.length === 0) return [];

    return childrenUnorderedKeys.sort((a, b) => {
      const aOrder = editor.children[a].meta.order;
      const bOrder = editor.children[b].meta.order;

      return aOrder - bOrder;
    });

    //[TODO] - unnecesary
  }, [childrenUnorderedKeys]);

  const blocks: JSX.Element[] = [];

  for (let i = 0; i < childrenKeys.length; i++) {
    const childrenId = childrenKeys[i];
    const block = editor.children[childrenId];

    if (!block) {
      // @ts-ignore
      console.error(`Plugin ${block.type} not found`);
      continue;
    }

    blocks.push(
      // 最外层
      <Block key={childrenId} block={block} blockId={childrenId}>
        123
      </Block>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        disabled={false}
        items={['11111']}
        strategy={verticalListSortingStrategy}
      >
        {blocks}
      </SortableContext>
    </DndContext>
  );
};

export default RenderBlocks;

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCallback } from 'react';
import { EditorType } from '../../preset/types';

export const useEditorDragDrop = ({ editor }: { editor: EditorType }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const newPluginPosition = editor.children[over.id].meta.order;
      // editor.moveBlock(active.id as string, [newPluginPosition]);
      console.log('editor.moveBlock', active.id, newPluginPosition);
    }
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    // editor.setBlockSelected(null);
    console.log('editor.setBlockSelected', event);
  }, []);

  return { sensors, handleDragEnd, handleDragStart };
};

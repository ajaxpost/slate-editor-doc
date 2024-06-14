import { SlateElement } from '../../preset/types';
import { generateId } from '../../utils/generateId';

export const buildBlockElement = (
  element?: Partial<SlateElement>
): SlateElement => ({
  id: generateId(),
  type: element?.type || 'paragraph',
  children: element?.children || [{ text: '' }],
  props: {
    nodeType: 'block',
    ...element?.props,
  },
});

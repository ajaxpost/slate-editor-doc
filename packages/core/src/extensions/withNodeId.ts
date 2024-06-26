import { Editor } from 'slate';
import { generateId } from '../utils/generateId';

export const withNodeId = (slate: Editor) => {
  const { apply } = slate;

  slate.apply = (operation) => {
    if (operation.type === 'split_node') {
      // @ts-ignore
      operation.properties.id = generateId();

      return apply(operation);
    }

    return apply(operation);
  };

  return slate;
};

import { Editor, Transforms, Element } from 'slate';
import { generateId } from '../utils/generateId';

export const onSelect = (
  _: React.SyntheticEvent<HTMLDivElement, Event>,
  slate: Editor
) => {
  const { selection } = slate;
  if (selection) {
    // @ts-ignore
    const [node] = Editor.above(slate);

    if (Editor.isEmpty(slate, node)) {
      for (const [node, path] of Editor.nodes(slate, {
        at: Editor.range(slate, []), // 获取所有nodes
      })) {
        if (Element.isElement(node) && node.type === 'placeholder') {
          Transforms.setNodes(
            slate,
            { type: 'paragraph', id: generateId() },
            { at: path }
          );
        }
      }
      Transforms.setNodes(slate, { type: 'placeholder' });
    }
  }
};

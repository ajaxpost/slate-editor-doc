// @ts-nocheck

import { Transforms, Element, Editor } from 'slate';
import { EditorType } from '../preset/types';
import { buildBlockElement } from '../utils/editorBuilders';
import { getRootBlockElementType } from '../utils/pluginElementType';
import { generateId } from '../utils/generateId';

export function createBlock(
  editor: EditorType,
  type: string,
  options: Record<string, unknown>
) {
  // TODO: create block
  const slate = editor.slate;
  if (!slate || !slate.selection) return;
  const selectPlugin = editor.plugins[type];
  const rootBlockElementType = getRootBlockElementType(selectPlugin.elements);
  const rootBlockElement = selectPlugin.elements[rootBlockElementType!];
  if (!rootBlockElement) return;
  const nodeProps = {
    nodeType: rootBlockElement.props?.nodeType || 'block',
    ...rootBlockElement.props,
  };
  const elementNode = buildBlockElement({
    type: rootBlockElementType,
    props: nodeProps,
  });

  Transforms.setNodes(slate, elementNode, {
    match: (n) => {
      return !Editor.isEditor(n) && Element.isElement(n);
    },
    mode: 'highest',
  });

  /**
   * mode 选项决定了如何匹配节点。它有两个可能的值：'highest' 和 'lowest'。

    'highest'：这意味着只有最高（最外层）的匹配节点会被选中。如果有一个匹配的节点包含另一个匹配的节点，只有外部的节点会被选中。
    'lowest'：这意味着只有最低（最内层）的匹配节点会被选中。如果有一个匹配的节点包含另一个匹配的节点，只有内部的节点会被选中。
    默认是 'lowest'。
   */
  // @ts-ignore
  // Transforms.setNodes(slate, elementNode, {
  //   match: (n) => Element.isElement(n),
  //   mode: 'highest',
  // });
}

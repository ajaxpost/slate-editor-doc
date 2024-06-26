import {
  EditorType,
  PluginElement,
  SlateElement,
  buildBlockElement,
} from '@slate-doc/core';
import { Editor, Element, Transforms } from 'slate';

export function create(type: string) {
  return function (editor: EditorType, element: Partial<PluginElement>) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;
    const elementNode = buildBlockElement({
      type,
      props: element.props,
    });
    const match = Editor.above<SlateElement>(slate, {
      at: slate.selection,
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node, path] = match;
    if (!node) return;
    const parentEntry = Editor.parent(slate, path);
    const [parentNodeElement] = parentEntry;
    if (Element.isElement(parentNodeElement)) {
      Transforms.setNodes(
        slate,
        {
          ...elementNode,
          props: {
            ...elementNode.props,
            wrap: true,
          },
        },
        {
          match: (n) => {
            return !Editor.isEditor(n) && Element.isElement(n);
          },
        }
      );
      return;
    }

    if (node.type === 'paragraph') {
      Transforms.setNodes(slate, elementNode, {
        match: (n) => {
          return !Editor.isEditor(n) && Element.isElement(n);
        },
      });
    } else {
      Editor.withoutNormalizing(slate, () => {
        Transforms.wrapNodes(slate, node, {
          match: (n) => {
            return !Editor.isEditor(n) && Element.isElement(n);
          },
        });
        Transforms.setNodes(
          slate,
          {
            ...elementNode,
            props: {
              ...elementNode.props,
              wrap: true,
            },
          },
          {
            match: (n) => {
              return !Editor.isEditor(n) && Element.isElement(n);
            },
          }
        );
      });
    }
  };
}

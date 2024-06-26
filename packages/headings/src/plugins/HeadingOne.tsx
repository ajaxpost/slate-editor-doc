import {
  EditorPlugin,
  EditorType,
  PluginElement,
  RenderElementProps,
  SlateElement,
  buildBlockElement,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { Editor, Transforms, Element } from 'slate';

const HeadingOneRender = (props: RenderElementProps) => {
  return (
    <h1
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        margin: 0;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
      `}
    >
      {props.children}
    </h1>
  );
};

const HeaderOne = new EditorPlugin({
  type: 'heading-one',
  elements: {
    render: HeadingOneRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: ['#', 'h1'],
    create: (editor: EditorType, element: Partial<PluginElement>) => {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      const elementNode = buildBlockElement({
        type: 'heading-one',
        props: element.props,
      });
      const match = Editor.above<SlateElement>(slate, {
        at: slate.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
      });
      if (!match) return;
      const [node] = match;
      if (!node) return;

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
    },
    match(elements) {
      return true;
    },
  },
});

export { HeaderOne };

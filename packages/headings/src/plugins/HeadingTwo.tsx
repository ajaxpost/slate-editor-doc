import {
  EditorPlugin,
  EditorType,
  PluginElement,
  RenderElementProps,
  SlateElement,
  buildBlockElement,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { Editor, Element, Transforms } from 'slate';

const HeadingTwoRender = (props: RenderElementProps) => {
  return (
    <h2
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      data-wrap={props.element.props?.wrap}
      className={css`
        margin: 0;
        ${!props.element.props?.wrap
          ? `
          margin-top: 1rem;
        margin-bottom: 0.5rem;
          `
          : ''}
      `}
    >
      {props.children}
    </h2>
  );
};

const HeaderTwo = new EditorPlugin({
  type: 'heading-two',
  elements: {
    render: HeadingTwoRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: ['##', 'h2'],
    create: (editor: EditorType, element: Partial<PluginElement>) => {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      const elementNode = buildBlockElement({
        type: 'heading-two',
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

export { HeaderTwo };

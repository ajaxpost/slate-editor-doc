import {
  EditorPlugin,
  EditorType,
  PluginElement,
  RenderElementProps,
  SlateElement,
  buildBlockElement,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';
import { Editor, Transforms, Element } from 'slate';

const BlockQuoteRender = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        border-width: 0px;
        border-left-width: 2px;
        border-style: solid;
        border-color: #e5e7eb;
        padding-left: 1.5rem;
        font-style: italic;
        margin: 0;
      `}
    >
      {props.children}
    </blockquote>
  );
};

const BlockQuote = new EditorPlugin({
  type: 'blockquote',
  elements: {
    render: BlockQuoteRender,
    props: {
      nodeType: 'block',
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['>', 'blockquote'],
    create: (editor: EditorType, element: Partial<PluginElement>) => {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      const elementNode = buildBlockElement({
        type: 'blockquote',
        props: element.props,
      });
      const match = Editor.above<SlateElement>(slate, {
        at: slate.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
      });
      if (!match) return;
      const [node] = match;
      if (!node) return;
      Editor.withoutNormalizing(slate, () => {
        Transforms.wrapNodes(slate, elementNode, {
          split: true,
        });
        Transforms.setNodes(slate, {
          ...node,
          props: {
            ...node.props,
            wrap: true,
          },
        });
      });
    },
    match(editor) {
      return true;
    },
  },
});

export { BlockQuote };

import {
  EditorPlugin,
  SlateElement,
  contextType,
  generateId,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';
import { create } from '../opts/create';
import { Editor, Element, Transforms } from 'slate';

const BlockQuoteRender = (context: contextType) => {
  return (
    <blockquote
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
        position: relative;
        width: 100%;
      `}
    >
      {context.children}
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
    embedded: false,
    create: create('blockquote'),
    destroy(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      const match = Editor.above<SlateElement>(slate, {
        at: slate.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
        mode: 'highest',
      });
      if (!match) return;
      const [node, path] = match;
      if (node['blockquote']) {
        Editor.withoutNormalizing(slate, () => {
          const nodes = Editor.nodes(slate, {
            at: path,
            mode: 'all',
            match: (n) =>
              Element.isElement(n) &&
              Editor.isBlock(slate, n) &&
              !!n['blockquote-item'],
          });
          for (const [, path] of nodes) {
            Transforms.unsetNodes(slate, ['blockquote-item'], {
              at: path,
            });
            if (path.length === 2) {
              Transforms.setNodes(
                slate,
                {
                  id: generateId(),
                },
                {
                  at: path,
                }
              );
            }
          }
          Transforms.unwrapNodes(slate, {
            at: path,
            match: (n) =>
              Element.isElement(n) &&
              Editor.isBlock(slate, n) &&
              !!n['blockquote'],
            split: true,
          });
        });
      }
    },
    match(context) {
      return !!context.props.element['blockquote'];
    },
    hotkey: ['mod+u'],
  },
});

export { BlockQuote };

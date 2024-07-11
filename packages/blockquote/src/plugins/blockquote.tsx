import { EditorPlugin, contextType } from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';
import { create } from '../opts/create';

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
    match(context) {
      return !!context.props.element['blockquote'];
    },
  },
});

export { BlockQuote };

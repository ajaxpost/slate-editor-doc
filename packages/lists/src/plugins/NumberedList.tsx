import { contextType, EditorPlugin } from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown_num';
import { create } from '../opts/create';

const NumberedListRender = (context: contextType) => {
  const ol = context.props.element['numbered-list'];
  const li = context.props.element['numbered-item'];

  if (ol) {
    return (
      <ol
        className={css`
          margin: 0;
          padding-left: 20px;
        `}
      >
        {context.children}
      </ol>
    );
  }
  if (li) {
    const leval = (li['leval'] || 0) as number;
    return (
      <li
        className={css`
          margin-left: ${leval * 20}px;
          position: relative;
          width: 100%;
        `}
      >
        {context.children}
      </li>
    );
  }

  return context.children;
};

const NumberedList = new EditorPlugin({
  type: 'numbered-list',
  elements: {
    render: NumberedListRender,
    props: {
      nodeType: 'block',
      leval: 0,
      start: 1,
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['1.'],
    embedded: true,
    unEmbedList: ['bulleted-list', 'bulleted-item'],
    create: create('numbered-list'),
    match(context) {
      return (
        !!context.props.element['numbered-list'] ||
        !!context.props.element['numbered-item']
      );
    },
  },
});
export { NumberedList };

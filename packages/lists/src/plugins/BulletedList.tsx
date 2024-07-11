import { EditorPlugin, Plugin, contextType } from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';
import { create } from '../opts/create';

const BulletedListRender = (context: contextType) => {
  const ul = context.props.element['bulleted-list'];
  const li = context.props.element['bulleted-item'];

  if (ul) {
    return (
      <ul
        className={css`
          margin: 0;
          padding-left: 10px;
        `}
      >
        {context.children}
      </ul>
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

const BulletedList = new EditorPlugin({
  type: 'bulleted-list',
  elements: {
    render: BulletedListRender,
    props: {
      nodeType: 'block',
      leval: 0,
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['-'],
    embedded: true,
    create: create('bulleted-list'),
    match(context) {
      return (
        !!context.props.element['bulleted-list'] ||
        !!context.props.element['bulleted-item']
      );
    },
    hotkey: ['mod+8'],
  },
} as Plugin);

export { BulletedList };

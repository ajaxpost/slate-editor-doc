import {
  contextType,
  EditorPlugin,
  generateId,
  SlateElement,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown_num';
import { create } from '../opts/create';
import { Editor, Element, Transforms } from 'slate';

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
    const start = (li['start'] || 1) as number;
    const leval = (li['leval'] || 0) as number;

    return (
      <li
        value={start}
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
    destroy(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      const match = Editor.above<SlateElement>(slate, {
        at: slate.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
      });
      if (!match) return;
      const [node, path] = match;
      const parentMatch = Editor.parent(slate, path);
      if (!parentMatch) return;
      const [parentNode, parentPath] = parentMatch;
      if (parentNode['numbered-list'] && node['numbered-item']) {
        Transforms.unwrapNodes(slate, {
          at: parentPath,
          match: (n) =>
            Element.isElement(n) &&
            Editor.isBlock(slate, n) &&
            !!n['numbered-list'],
          split: true,
        });
        Transforms.setNodes(slate, {
          id: generateId(),
        });
        Transforms.unsetNodes(slate, ['numbered-item']);
      }
    },
    match(context) {
      return (
        !!context.props.element['numbered-list'] ||
        !!context.props.element['numbered-item']
      );
    },
    hotkey: ['mod+7'],
  },
});
export { NumberedList };

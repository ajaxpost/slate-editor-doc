import {
  EditorPlugin,
  Plugin,
  SlateElement,
  contextType,
  generateId,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';
import { create } from '../opts/create';
import { Editor, Element, Transforms } from 'slate';

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
    embedded: true, // 可内嵌到其他node节点内
    unEmbedList: ['numbered-list', 'numbered-item'], // 不可内嵌到这些节点内
    create: create('bulleted-list'),
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
      if (parentNode['bulleted-list'] && node['bulleted-item']) {
        Transforms.unwrapNodes(slate, {
          at: parentPath,
          match: (n) =>
            Element.isElement(n) &&
            Editor.isBlock(slate, n) &&
            !!n['bulleted-list'],
          split: true,
        });
        Transforms.setNodes(slate, {
          id: generateId(),
        });
        Transforms.unsetNodes(slate, ['bulleted-item']);
      }
    },
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

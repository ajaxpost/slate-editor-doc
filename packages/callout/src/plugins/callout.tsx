import { ChangeEvent, FC, useState } from 'react';
import {
  contextType,
  EditorPlugin,
  EditorType,
  SlateElement,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { onKeyDown } from '../events/onKeyDown';
import { create } from '../opts/create';
import { Transforms, Element, Editor } from 'slate';
import { ReactEditor } from 'slate-react';

interface IProps {
  context: contextType;
}

const ThemeSelect: FC<IProps> = ({ context }) => {
  const props = context.props.element['callout'] as Record<string, unknown>;
  const theme = props['theme'] as string;
  const [value, setValue] = useState(theme);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const editorState = context.editorState;
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    const v = e.target.value;
    const path = ReactEditor.findPath(slate, context.props.element);

    setValue(v);
    Transforms.setNodes(
      slate,
      { callout: { theme: v } },
      {
        at: path,
        match: (n) => {
          return (
            Element.isElement(n) && Editor.isBlock(slate, n) && !!n['callout']
          );
        },
      }
    );
  };

  return (
    <select
      className={css`
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 9999;
      `}
      value={value}
      onChange={onChange}
    >
      <option value="default">default</option>
      <option value="info">info</option>
      <option value="success">success</option>
      <option value="warning">warning</option>
      <option value="error">error</option>
    </select>
  );
};

const CalloutRender = (context: contextType) => {
  const props = context.props.element['callout'] as Record<string, unknown>;
  const theme = props['theme'] as string;

  return (
    <div
      data-callout-theme={theme || 'default'}
      className={css`
        border-radius: 0.375rem;
        font-size: 16px;
        line-height: 1.75rem;
        padding: 0.5rem 0.5rem 0.5rem 1rem;
        margin: 10px 0;
        position: relative;
        &[data-callout-theme='default'] {
          background: rgb(245, 247, 249);
          color: #000;
        }
        &[data-callout-theme='info'] {
          background: rgb(225, 243, 254);
          border-left-color: rgb(8, 162, 231);
          border-left-width: 4px;
          color: rgb(8, 162, 231);
          border-left-style: solid;
        }
        &[data-callout-theme='success'] {
          background: rgb(209, 250, 229);
          border-left-color: rgb(18, 183, 127);
          border-left-width: 4px;
          color: rgb(18, 183, 127);
          border-left-style: solid;
        }
        &[data-callout-theme='warning'] {
          background: rgb(254, 243, 201);
          border-left-color: rgb(249, 116, 21);
          border-left-width: 4px;
          color: rgb(249, 116, 21);
          border-left-style: solid;
        }
        &[data-callout-theme='error'] {
          background: rgb(254, 225, 226);
          border-left-color: rgb(238, 68, 67);
          border-left-width: 4px;
          color: rgb(238, 68, 67);
          border-left-style: solid;
        }
        &:hover {
          button {
            opacity: 1;
          }
        }
      `}
    >
      <ThemeSelect context={context} />
      {context.children}
    </div>
  );
};

const Callout = new EditorPlugin({
  type: 'callout',
  elements: {
    render: CalloutRender,
    props: {
      theme: 'info',
    },
  },
  events: { onKeyDown },
  options: {
    shortcuts: ['<'],
    create: create('callout'),
    embedded: false,
    match(context) {
      return !!context.props.element['callout'];
    },
  },
});

export { Callout };

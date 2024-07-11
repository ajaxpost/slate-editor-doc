import { contextType, EditorPlugin, Plugin } from '@slate-doc/core';
import { create } from '../opts/create';
import { css } from '@emotion/css';

const DividingLineRender = (context: contextType) => {
  return (
    <>
      {context.children}
      <div contentEditable={false}>
        <div
          className={css`
            padding: 5px 0;
          `}
        >
          <div
            className={css`
              height: 1px;
              width: 100%;
              background-color: #c9cdd4;
            `}
          ></div>
        </div>
      </div>
    </>
  );
};

const DividingLine = new EditorPlugin({
  type: 'dividing-line',
  elements: {
    render: DividingLineRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: ['---'],
    embedded: false,
    create: create('dividing-line'),
    match(context) {
      return !!context.props.element['dividing-line'];
    },
  },
} as Plugin);

export { DividingLine };

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
import { create } from '../opts/create';

const HeadingTwoRender = (props: RenderElementProps) => {
  return (
    <h2
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      data-wrap={props.element.props?.wrap}
      className={css`
        position: relative;
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
    create: create('heading-two'),
    match(elements) {
      return true;
    },
  },
});

export { HeaderTwo };

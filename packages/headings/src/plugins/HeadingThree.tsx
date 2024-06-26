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

const HeadingThreeRender = (props: RenderElementProps) => {
  return (
    <h3
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      data-wrap={props.element.props?.wrap}
      className={css`
        position: relative;
        margin: 0;
        ${!props.element.props?.wrap
          ? `
          margin-top: 0.5rem;
        margin-bottom: 0.5rem;
          `
          : ''}
      `}
    >
      {props.children}
    </h3>
  );
};

const HeaderThree = new EditorPlugin({
  type: 'heading-three',
  elements: {
    render: HeadingThreeRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: ['###', 'h3'],
    create: create('heading-three'),
    match(elements) {
      return true;
    },
  },
});

export { HeaderThree };

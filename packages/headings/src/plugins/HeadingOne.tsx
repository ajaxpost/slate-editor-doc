import {
  EditorPlugin,
  EditorType,
  PluginElement,
  RenderElementProps,
  SlateElement,
  buildBlockElement,
} from '@slate-doc/core';
import { css } from '@emotion/css';
import { Editor, Transforms, Element } from 'slate';
import { create } from '../opts/create';

const HeadingOneRender = (props: RenderElementProps) => {
  return (
    <h1
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      data-wrap={props.element.props?.wrap}
      className={css`
        position: relative;
        margin: 0;
        ${!props.element.props?.wrap
          ? `
          margin-top: 1.5rem;
        margin-bottom: 0.5rem;
          `
          : ''}
      `}
    >
      {props.children}
    </h1>
  );
};

const HeaderOne = new EditorPlugin({
  type: 'heading-one',
  elements: {
    render: HeadingOneRender,
    props: {
      nodeType: 'block',
    },
  },
  options: {
    shortcuts: ['#', 'h1'],
    create: create('heading-one'),
    match(elements) {
      return true;
    },
  },
});

export { HeaderOne };

import { EditorPlugin, contextType } from '@slate-doc/core';
import { css } from '@emotion/css';
import { create } from '../opts/create';
import { onKeyDown } from '../event/onKeyDown';

const HeadingOneRender = (context: contextType) => {
  const leval =
    (context.props.element['heading'] as Record<string, unknown>).leval || 1;

  switch (leval) {
    case 1:
      return (
        <h1
          className={css`
            position: relative;
            font-size: 2.25em;
            line-height: 1.2;
            border-bottom: 1px solid #eee;
            white-space: pre-wrap;
            margin: 7px 0;
          `}
        >
          {context.children}
        </h1>
      );
    case 2:
      return (
        <h2
          className={css`
            position: relative;
            margin: 7px 0;
            font-size: 1.75em;
            line-height: 1.225;
            border-bottom: 1px solid #eee;
            white-space: pre-wrap;
          `}
        >
          {context.children}
        </h2>
      );
    case 3:
      return (
        <h3
          className={css`
            position: relative;
            margin: 7px 0;
            font-size: 1.5em;
            line-height: 1.43;
            white-space: pre-wrap;
          `}
        >
          {context.children}
        </h3>
      );
    case 4:
      return (
        <h4
          className={css`
            position: relative;
            margin: 7px 0;
            font-size: 1.25em;
            white-space: pre-wrap;
          `}
        >
          {context.children}
        </h4>
      );
    case 5:
      return (
        <h5
          className={css`
            position: relative;
            margin: 7px 0;
            font-size: 1em;
            white-space: pre-wrap;
          `}
        >
          {context.children}
        </h5>
      );
    case 6:
      return (
        <h6
          className={css`
            position: relative;
            margin: 7px 0;
            font-size: 1em;
            color: #777;
            white-space: pre-wrap;
          `}
        >
          {context.children}
        </h6>
      );

    default:
      return context.children;
  }
};

const Heading = new EditorPlugin({
  type: 'heading',
  elements: {
    render: HeadingOneRender,
    props: {
      nodeType: 'block',
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['#', '##', '###', '####', '#####', '######'],
    embedded: true,
    create: create('heading'),
    match(context) {
      return !!context.props.element.heading;
    },
  },
});

export { Heading };

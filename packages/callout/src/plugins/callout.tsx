import { EditorPlugin, RenderElementProps, useReadOnly } from '@slate-doc/core';
import { css } from '@emotion/css';

const CalloutRender = (props: RenderElementProps) => {
  const readOnly = useReadOnly();

  return (
    <div
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      data-callout-theme={props.element.props?.theme || 'default'}
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
      {!readOnly && (
        <button
          className={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgb(238, 238, 238);
            border-radius: 2px;
            border-style: none;
            cursor: pointer;
            height: 22px;
            padding: 0 4px;
            position: absolute;
            right: 8px;
            top: 8px;
            width: 22px;
            z-index: 10;
            transition: opacity 0.15s ease-in-out;
            opacity: 0;
          `}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      )}
      {props.children}
    </div>
  );
};

const Callout = new EditorPlugin({
  type: 'Callout',
  elements: {
    callout: {
      render: CalloutRender,
      props: {
        nodeType: 'block',
        theme: 'default',
      },
    },
  },
  options: {
    shortcuts: ['<'],
  },
});

export { Callout };

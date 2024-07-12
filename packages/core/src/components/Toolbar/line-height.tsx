import { Button, Popover, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useEditorState } from '../../context/editor-context';
import { btn, icon, widget } from './css';
import { css } from '@emotion/css';
import { Check } from 'lucide-react';
import { Editor, Transforms } from 'slate';
import { SlateElement } from '../../preset/types';

const config = [
  {
    label: '默认',
    value: '',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '1.15',
    value: '1.15',
  },
  {
    label: '1.5',
    value: '1.5',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '2.5',
    value: '2.5',
  },
  {
    label: '3',
    value: '3',
  },
];

const LineHeight: FC = () => {
  const [open, setOpen] = useState(false);
  const editorState = useEditorState();
  const slate = editorState.slate;

  useEffect(() => {
    const click = () => setOpen(false);
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('click', click);
    };
  }, []);

  const handlerClick = (item) => {
    if (!slate || !slate.selection) return;
    setOpen(false);
    Transforms.setNodes(slate, {
      'line-height': item.value,
    });
  };

  const match = Editor.above<SlateElement>(slate!, {
    at: slate?.selection!,
  });
  if (!match) return;
  const [node] = match;
  const lineHeight = node['line-height'] || '';

  return (
    <Popover
      arrow={false}
      open={open}
      trigger={['click']}
      overlayInnerStyle={{
        borderRadius: 5,
        background: '#fff',
        border: '1px solid #e7e9e8',
        boxShadow: '0 8px 16px 4px rgb(0 0 0 / 4%)',
        color: '#262626',
        width: 'auto',
        boxSizing: 'border-box',
        padding: 0,
      }}
      content={
        <div
          className={css`
            display: flex;
            justify-content: flex-start;
            align-items: center;
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <ul
            className={css`
              list-style: none;
              outline: none;
              padding: 4px 0;
              margin: 0;
              box-sizing: border-box;
            `}
          >
            {config.map((item) => {
              return (
                <li
                  key={item.value}
                  onClick={() => handlerClick(item)}
                  className={css`
                    min-width: 104px;
                    padding-right: 2px;
                    font-size: 12px;
                    white-space: nowrap;
                    padding-left: 32px;
                    margin: 0;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    cursor: pointer;
                    line-height: 22px;
                    font-weight: 400;
                    box-sizing: border-box;
                    &:hover {
                      background-color: #eff0f0;
                    }
                  `}
                >
                  <div
                    className={css`
                      display: flex;
                      align-items: center;
                      line-height: 30px;
                      padding-right: 16px;
                    `}
                  >
                    {/* check */}
                    {item.value === lineHeight && (
                      <div
                        className={`${css`
                          margin-right: 10px;
                          position: absolute;
                          left: 10px;
                          color: #000;
                        `} ${icon}`}
                      >
                        <Check size={16} />
                      </div>
                    )}

                    {/* label */}
                    <div>{item.label}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      }
    >
      <span className={widget}>
        <Tooltip arrow={false} title={'行高调整'} zIndex={1001}>
          <Button
            className={btn}
            data-actived={open}
            type="text"
            style={{
              gap: 0,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <div
              className={css`
                width: 26px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                height: 1em;
                font-size: 16px;
                background-position: 50%;
                background-repeat: no-repeat;
              `}
            >
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="currentColor" fillRule="nonzero">
                  <path d="M218 148c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 168h-82c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L136 148h82ZM218 89c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 109h-82c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L136 89h82ZM218 30c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 50h-82c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L136 30h82ZM218 207c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996L218 227h-82c-5.523 0-10-4.477-10-10 0-5.43 4.327-9.848 9.72-9.996L136 207h82ZM96.188 60.23 67.375 30.847a6.103 6.103 0 0 0-8.75 0L29.812 60.229c-2.416 2.464-2.416 6.46 0 8.923A6.127 6.127 0 0 0 34.187 71h57.626C95.23 71 98 68.175 98 64.69a6.373 6.373 0 0 0-1.812-4.46ZM96.188 195.77l-28.813 29.382a6.103 6.103 0 0 1-8.75 0l-28.813-29.381c-2.416-2.464-2.416-6.46 0-8.923A6.127 6.127 0 0 1 34.187 185h57.626c3.417 0 6.187 2.825 6.187 6.31a6.373 6.373 0 0 1-1.812 4.46Z"></path>
                </g>
              </svg>
            </div>
            <span
              className={css`
                width: 16px;
                height: 16px;
                background-position: 50%;
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
                background-image: url(https://gw.alipayobjects.com/zos/bmw-prod/d5fce5b0-cd60-43b0-a351-9463486be4d2.svg);
              `}
            ></span>
          </Button>
        </Tooltip>
      </span>
    </Popover>
  );
};

export default LineHeight;

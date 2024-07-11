import { FC, useEffect, useState } from 'react';
import { widget, btn } from './css';
import { Button, Tooltip, Popover } from 'antd';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { css } from '@emotion/css';
import { Editor, Transforms } from 'slate';
import { useEditorState } from '../../context/editor-context';
import { SlateElement } from '../../preset/types';

const items = [
  {
    label: '左对齐',
    icon: <AlignLeft size={18} />,
    value: 'left',
  },
  {
    label: '居中对齐',
    icon: <AlignCenter size={18} />,
    value: 'center',
  },
  {
    label: '右对齐',
    icon: <AlignRight size={18} />,
    value: 'right',
  },
];

const Align: FC = () => {
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

  const alignClick = (item) => {
    if (!slate || !slate.selection) return;
    setOpen(false);
    Transforms.setNodes(slate, {
      align: item.value,
    });
  };

  const match = Editor.above<SlateElement>(slate!, {
    at: slate?.selection!,
  });
  if (!match) return;
  const [node] = match;
  const align = node.align || 'left';
  const find = items.find((o) => o.value === align);

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
        display: 'flex',
        height: '40px',
        width: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '0 5px',
        boxSizing: 'border-box',
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
          {items.map((item) => {
            return (
              <Tooltip arrow={false} title={item.label} key={item.value}>
                <div
                  className={css`
                    width: 28px;
                    height: 28px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    border-radius: 5px;
                    &:hover {
                      background-color: #e7e9e8;
                    }
                    background-color: ${align === item.value
                      ? '#e7e9e8'
                      : 'transparent'};
                    &:first-child {
                      margin-left: 0;
                    }
                    margin-left: 3px;
                  `}
                  onClick={() => alignClick(item)}
                >
                  <div
                    className={css`
                      display: inline-flex;
                      justify-content: center;
                      align-items: center;
                      width: 1em;
                      height: 1em;
                      font-size: 16px;
                      background-position: 50%;
                      background-repeat: no-repeat;
                    `}
                  >
                    {item.icon}
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
      }
    >
      <span className={widget}>
        <Tooltip arrow={false} title={'对齐方式'} zIndex={1001}>
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
              {find?.icon}
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

export default Align;

/**
 * 正文和标题
 */

import { FC, CSSProperties, useState, useEffect } from 'react';
import { btn, icon, widget } from './css';
import { Button, Dropdown, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { Check } from 'lucide-react';
import { useEditorState } from '../../context/editor-context';
import { Transforms, Editor } from 'slate';
import { SlateElement } from '../../preset/types';
import { useToolbarState } from '../../context/toolbar-context';

const li: CSSProperties = {
  position: 'relative',
  padding: '4px 15px 4px 25px',
};

const items = [
  {
    key: 'text',
    label: '正文',
    className: css`
      font-size: 16px;
      font-weight: 700;
    `,
  },
  {
    key: '#',
    label: '标题1',
    className: css`
      font-size: 28px;
      font-weight: 700;
      line-height: 1.6;
    `,
  },
  {
    key: '##',
    label: '标题2',
    className: css`
      font-size: 24px;
      font-weight: 700;
      line-height: 1.6;
    `,
  },
  {
    key: '###',
    label: '标题3',
    className: css`
      font-size: 20px;
      font-weight: 700;
      line-height: 1.6;
    `,
  },
  {
    key: '####',
    label: '标题4',
    className: css`
      font-size: 16px;
      font-weight: 700;
      line-height: 1.6;
    `,
  },
  {
    key: '#####',
    label: '标题5',
    className: css`
      font-size: 14px;
      font-weight: 700;
      line-height: 1.6;
    `,
  },
  {
    key: '######',
    label: '标题6',
    className: css`
      font-size: 14px;
      font-weight: 700;
      line-height: 1.6;
    `,
  },
];

type ArrayElement<T> = T extends (infer U)[] ? U : never;

const render = (item: ArrayElement<typeof items>, active: boolean) => {
  return (
    <>
      <div
        className={css`
          position: absolute;
          left: 5px;
          top: 0;
          bottom: 0;
          width: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: ${active ? 1 : 0};
        `}
      >
        <div className={icon}>
          <Check size={16} />
        </div>
      </div>
      <div
        className={css`
          margin-left: 10px;
          flex-grow: 1;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            white-space: nowrap;
          `}
        >
          <span className={item.className}>{item.label}</span>
          <span
            className={css`
              color: #bec0bf;
              margin-left: 65px;
            `}
          ></span>
        </div>
      </div>
    </>
  );
};

const TextAndTitle: FC = () => {
  const editorState = useEditorState();
  const [activeKey, setActiveKey] = useState('');
  const toolbarState = useToolbarState();

  useEffect(() => {
    const value = toolbarState.textAndTitle;
    setActiveKey(value || '');
  }, [toolbarState]);

  const handlerClick = (item: ArrayElement<typeof items>) => {
    setActiveKey(item.key);
    if (item.key === 'text') {
      const slate = editorState.slate!;
      const { selection } = slate;
      if (!selection) return;
      const match = Editor.above<SlateElement>(editorState.slate!, {
        at: selection,
      });
      if (!match) return;
      const [node, path] = match;
      Transforms.delete(slate, {
        at: path,
      });
      Transforms.insertNodes(slate, {
        id: node.id,
        children: node.children,
        align: node.align,
      });
    } else {
      const heading = editorState.plugins.heading;
      heading.options?.create?.(editorState, {}, { beforeText: item.key });
    }
  };

  return (
    <span className={widget}>
      <Dropdown
        trigger={['click']}
        menu={{
          items: items.map((item) => {
            return {
              key: item!.key as string,
              style: li,
              label: render(item, activeKey === item.key),
              onClick: () => handlerClick(item),
            };
          }),
          style: {
            padding: '4px 0',
            background: '#fff',
            boxShadow: '0 8px 16px 4px rgb(0 0 0 / 4%)',
            border: '1px solid #e7e9e8',
            borderRadius: 8,
          },
          onMouseDown: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }}
      >
        <Tooltip arrow={false} title={'正文和标题'} zIndex={1001}>
          <Button
            className={btn}
            style={{
              marginLeft: 10,
              padding: '0 5px 0 10px',
            }}
            type="text"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* value */}
            <div
              className={css`
                width: 40px;
                text-align: left;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #000000;
              `}
            >
              {items.find((o) => o.key === activeKey)?.label}
            </div>
            {/* 箭头 */}
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
      </Dropdown>
    </span>
  );
};

export default TextAndTitle;

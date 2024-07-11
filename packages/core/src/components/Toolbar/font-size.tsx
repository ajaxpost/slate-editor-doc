import { CSSProperties, FC, useEffect, useState } from 'react';
import { widget, icon, btn } from './css';
import { Button, Dropdown, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { Check } from 'lucide-react';
import { useToolbarState } from '../../context/toolbar-context';
import { Editor, Range, Transforms } from 'slate';
import { useEditorState } from '../../context/editor-context';

const li: CSSProperties = {
  position: 'relative',
  padding: '4px 15px 4px 25px',
};

const items = [
  {
    key: '12px',
    label: '12px',
  },
  {
    key: '13px',
    label: '13px',
  },
  {
    key: '14px',
    label: '14px',
  },
  {
    key: '15px',
    label: '15px',
  },
  {
    key: '16px',
    label: '16px',
  },
  {
    key: '19px',
    label: '19px',
  },
  {
    key: '22px',
    label: '22px',
  },
  {
    key: '24px',
    label: '24px',
  },
  {
    key: '29px',
    label: '29px',
  },
  {
    key: '32px',
    label: '32px',
  },
  {
    key: '40px',
    label: '40px',
  },
  {
    key: '48px',
    label: '48px',
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
          <span>{item.label}</span>
          <span
            className={css`
              color: #bec0bf;
              margin-left: 15px;
            `}
          ></span>
        </div>
      </div>
    </>
  );
};

const FontSize: FC = () => {
  const [active, setActive] = useState({
    size: '',
    disabled: false,
  });
  const toolbarState = useToolbarState();
  const editorState = useEditorState();

  useEffect(() => {
    const value = toolbarState.fontSize;
    value && setActive(value);
  }, [toolbarState]);

  const handlerClick = (item: ArrayElement<typeof items>) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    setActive({
      size: item.key,
      disabled: false,
    });
    const collapsed = Range.isCollapsed(slate.selection);
    if (collapsed) {
      // 需要手动选中
      const start = Editor.start(slate, slate.selection?.anchor.path!);
      const range = { anchor: slate.selection.anchor, focus: start };
      Transforms.select(slate, range);
    }
    Transforms.setNodes(slate, {
      fontSize: item.key,
    });

    // 取消选中
    if (collapsed) {
      Transforms.collapse(slate, { edge: 'end' });
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
              label: render(item, active.size === item.key),
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
        <Tooltip arrow={false} title={'字号调整'} zIndex={1001}>
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
            disabled={active.disabled}
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
              {items.find((o) => o.key === active.size)?.label}
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

export default FontSize;

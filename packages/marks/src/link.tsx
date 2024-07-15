import { FC, ReactNode, useEffect, useState, useRef } from 'react';
import {
  EditorPlugin,
  generateId,
  leafContextType,
  LeafPlugin,
} from '@slate-doc/core';
import { Editor, Path, Range, Text, Transforms } from 'slate';
import { Button, Input, InputRef, Popover, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { Link2Off, Pencil, SquareArrowOutUpRight } from 'lucide-react';

interface IProps {
  children: ReactNode;
  leaf: Text;
  slate: Editor;
}

const LinkComponent: FC<IProps> = ({ children, leaf, slate }) => {
  const [open, setOpen] = useState(leaf.link?.open);
  const [optionOpen, setOptionOpen] = useState(false);
  const [data, setData] = useState({
    label: leaf.text,
    link: leaf.link?.link || '',
  });
  const textRef = useRef<InputRef | null>(null);

  useEffect(() => {
    const click = () => {
      setOpen(false);
      setOptionOpen(false);
    };
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('click', click);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const target = textRef.current;
    setTimeout(() => {
      target?.focus();
    }, 0);
  }, [open]);

  const submit = () => {
    if (!slate || !slate.selection) return;
    const nodes = Editor.nodes<Text>(slate, {
      at: [],
      match: (n) => Text.isText(n) && n.link?.id === leaf.link?.id,
    });
    for (const [node, path] of nodes) {
      if (!node.link) return;
      const start = Editor.start(slate, path);
      const end = Editor.end(slate, path);
      const range = { anchor: end, focus: start };
      Transforms.select(slate, range);
      Editor.addMark(slate, 'link', {
        link: data.link,
        id: leaf.link?.id,
        open: false,
      });
      Editor.insertText(slate, data.label);
    }
    setOpen(false);
  };

  const edit = () => {
    setData({
      label: leaf.text,
      link: leaf.link?.link || '',
    });
    setOpen(true);
    setOptionOpen(false);
  };

  const visit = () => {
    if (!data.link) return;
    data.link.includes('http') || data.link.includes('https')
      ? window.open(data.link)
      : window.open('http://' + data.link);
  };

  const cancel = () => {
    if (!slate || !slate.selection) return;
    const nodes = Editor.nodes<Text>(slate, {
      at: [],
      match: (n) => Text.isText(n) && n.link?.id === leaf.link?.id,
    });
    for (const [node, path] of nodes) {
      if (!node.link) return;
      const start = Editor.start(slate, path);
      const end = Editor.end(slate, path);
      const range = { anchor: end, focus: start };
      Transforms.select(slate, range);

      Editor.removeMark(slate, 'link');
    }
  };

  return (
    <Popover
      open={open}
      overlayInnerStyle={{
        padding: 0,
      }}
      arrow={false}
      placement="bottomLeft"
      content={
        <div
          onClick={(e) => e.stopPropagation()}
          className={css`
            background-color: #fff;
            border: 1px solid #e7e9e8;
            box-shadow: 0 8px 16px 4px rgb(0 0 0 / 4%);
            color: #262626;
            width: 365px;
            padding: 16px 12px;
            font-size: 14px;
            box-sizing: border-box;
          `}
        >
          <div
            className={css`
              margin-bottom: 16px;
              box-sizing: border-box;
            `}
          >
            <div
              className={css`
                margin-bottom: 16px;
                box-sizing: border-box;
              `}
            >
              文本
            </div>
            <Input
              ref={textRef}
              placeholder="添加描述"
              value={data.label}
              onChange={(e) => {
                setData({
                  ...data,
                  label: e.target.value,
                });
              }}
            />
          </div>
          <div
            className={css`
              margin-bottom: 16px;
              box-sizing: border-box;
            `}
          >
            <div
              className={css`
                margin-bottom: 16px;
                box-sizing: border-box;
              `}
            >
              链接
            </div>
            <Input
              placeholder="链接地址"
              value={data.link}
              onChange={(e) => {
                setData({
                  ...data,
                  link: e.target.value,
                });
              }}
            />
          </div>
          <Button disabled={!data.link} onClick={submit}>
            确&nbsp;定
          </Button>
        </div>
      }
    >
      <Popover
        arrow={false}
        open={optionOpen}
        overlayInnerStyle={{
          padding: 0,
        }}
        content={
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={css`
              background-color: #fff;
              border: 1px solid #e7e9e8;
              box-shadow: 0 8px 16px 4px rgb(0 0 0 / 4%);
              color: #262626;
              padding: 8px 12px;
              font-size: 14px;
              box-sizing: border-box;
            `}
          >
            <div
              className={css`
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: flex-start;
              `}
            >
              <Tooltip arrow={false} title="访问链接">
                <Button
                  onClick={visit}
                  type="text"
                  icon={<SquareArrowOutUpRight size={18} />}
                ></Button>
              </Tooltip>
              <Tooltip arrow={false} title="编辑链接">
                <Button
                  type="text"
                  onClick={edit}
                  icon={<Pencil size={18} />}
                ></Button>
              </Tooltip>
              <Tooltip arrow={false} title="取消链接">
                <Button
                  onClick={cancel}
                  type="text"
                  icon={<Link2Off size={18} />}
                ></Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <a
          onMouseEnter={() => {
            !open && setOptionOpen(true);
          }}
          className={css`
            color: #00b96b;
            &:hover {
              background-color: #f5f5f5;
              cursor: pointer;
            }
          `}
          onClick={visit}
        >
          {children}
        </a>
      </Popover>
    </Popover>
  );
};

const LinkRender = (context: leafContextType) => {
  const leaf = context.props.leaf;
  const slate = context.editorState.slate;
  if (!slate || !slate.selection) return;

  return (
    <LinkComponent leaf={leaf} slate={slate}>
      {context.children}
    </LinkComponent>
  );
};

const Link = new EditorPlugin({
  type: 'link',
  elements: {
    renderLeaf: LinkRender,
    props: {
      nodeType: 'inline',
    },
  },
  options: {
    create(editor) {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      let text = '链接';
      if (!Range.isCollapsed(slate.selection)) {
        text = Editor.string(slate, slate.selection);
      }
      Editor.addMark(slate, 'link', {
        link: '',
        id: generateId(),
        open: true,
      });
      Editor.insertText(slate, text);
    },
    matchLeaf(context) {
      return !!context.props.leaf['link'];
    },
    hotkey: ['mod+k'],
  },
} as LeafPlugin);

export { Link };

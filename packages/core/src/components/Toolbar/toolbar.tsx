import { FC, useMemo, useState, MouseEvent } from 'react';
import { css } from '@emotion/css';
import { Button, Tooltip } from 'antd';
import {
  Bold,
  CirclePlus,
  Code,
  Italic,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  List,
  ListOrdered,
  Link,
  TextQuote,
  Minus,
} from 'lucide-react';
import { EditorType, SlateElement } from '../../preset/types';
import { widget, btn, icon } from './css';
import Divider from './divider';
import TextAndTitle from './text-and-title';
import FontSize from './font-size';
import FontColor from './font-color';
import { Editor, Element, Transforms } from 'slate';
import BgColor from './bg-color';
import Align from './align';
import LineHeight from './line-height';
import { generateId } from '../../utils/generateId';

interface IProps {
  editorState: EditorType;
}

const isBold = (marks) => marks?.bold;

const isItalic = (marks) => marks?.italic;

const isStrikethrough = (marks) => marks?.strikethrough;

const isUnderline = (marks) => marks?.underline;

const isLineCode = (marks) => marks?.['line-code'];

const isBulletedList = (editorState: EditorType) => {
  const slate = editorState.slate;
  if (!slate || !slate.selection) return;
  const match = Editor.above<SlateElement>(slate, {
    at: slate.selection,
    match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
  });
  if (!match) return;
  const [node, path] = match;
  if (path.length < 2) return;
  const parentMatch = Editor.parent(slate, path);
  if (!parentMatch) return;
  const [parentNode] = parentMatch;
  if (parentNode['bulleted-list'] || node['bulleted-item']) return true;
};

const isNumberedList = (editorState: EditorType) => {
  const slate = editorState.slate;
  if (!slate || !slate.selection) return;
  const match = Editor.above<SlateElement>(slate, {
    at: slate.selection,
    match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
  });
  if (!match) return;
  const [node, path] = match;
  if (path.length < 2) return;
  const parentMatch = Editor.parent(slate, path);
  if (!parentMatch) return;
  const [parentNode] = parentMatch;
  if (parentNode['numbered-list'] || node['numbered-item']) return true;
};

const isLink = (marks) => !!marks?.link;

const isQuote = (editorState: EditorType) => {
  const slate = editorState.slate;
  if (!slate || !slate.selection) return;
  const match = Editor.above<SlateElement>(slate, {
    at: slate.selection,
    match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
  });
  if (!match) return;
  const [node, path] = match;
  if (path.length < 2) return;
  const parentMatch = Editor.parent(slate, path);
  if (!parentMatch) return;
  const [parentNode] = parentMatch;

  if (parentNode['blockquote'] || node['blockquote-item']) return true;
};

const isDividing = (editorState: EditorType) => {
  const slate = editorState.slate;
  if (!slate || !slate.selection) return;
  const match = Editor.above<SlateElement>(slate, {
    at: slate.selection,
    match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
  });
  if (!match) return;
  const [node, path] = match;
  if (node['dividing-line']) return true;
};

const Toolbar: FC<IProps> = ({ editorState }) => {
  const [refresh, setRefresh] = useState(0);
  const slate = useMemo(() => editorState.slate, [editorState]);

  const undo = () => {
    slate?.undo();
    setRefresh(refresh + 1);
  };

  const redo = () => {
    slate?.redo();
    setRefresh(refresh + 1);
  };

  const bold = () => {
    editorState.marks.bold?.options?.create?.(editorState);
  };

  const italic = () => {
    editorState.marks.italic?.options?.create?.(editorState);
  };

  const strikethrough = () => {
    editorState.marks.strikethrough?.options?.create?.(editorState);
  };

  const underline = () => {
    editorState.marks.underline?.options?.create?.(editorState);
  };

  const linecode = () => {
    editorState.marks['line-code']?.options?.create?.(editorState);
  };

  const bulletedListClick = () => {
    if (isBulletedList(editorState)) {
      editorState.plugins['bulleted-list'].options?.destroy?.(editorState);
    } else {
      editorState.plugins['bulleted-list'].options?.create?.(
        editorState,
        {
          props: {
            leval: 0,
          },
        },
        {
          beforeText: '-',
        }
      );
    }
  };

  const numberedListClick = () => {
    if (isNumberedList(editorState)) {
      editorState.plugins['numbered-list'].options?.destroy?.(editorState);
    } else {
      editorState.plugins['numbered-list'].options?.create?.(
        editorState,
        {
          props: {
            leval: 0,
            start: 1,
          },
        },
        { beforeText: '1.' }
      );
    }
  };

  const linkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLink(marks)) {
      editorState.marks.link?.options?.destroy?.(editorState);
    } else {
      editorState.marks.link?.options?.create?.(editorState);
    }
  };

  const quoteClick = () => {
    if (isQuote(editorState)) {
      editorState.plugins.blockquote?.options?.destroy?.(editorState);
    } else {
      editorState.plugins.blockquote?.options?.create?.(
        editorState,
        {},
        {
          beforeText: '>',
        }
      );
    }
  };

  const dividingClick = () => {
    if (isDividing(editorState)) {
      editorState.plugins['dividing-line']?.options?.destroy?.(editorState);
    } else {
      Transforms.insertNodes(
        editorState.slate!,
        {
          children: [{ text: '' }],
          id: generateId(),
        },
        {
          select: true,
        }
      );
      editorState.plugins['dividing-line']?.options?.create?.(
        editorState,
        {},
        { beforeText: '---' }
      );
    }
  };

  const marks = Editor.marks(slate!);

  return (
    <>
      <div
        className={css`
          position: fixed;
          height: 42px;
          width: 100%;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          background: #fff;
          font-size: 14px;
          z-index: 1001;
        `}
      >
        <div
          className={css`
            position: relative;
            height: 100%;
          `}
        >
          <div
            className={css`
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              height: 100%;
              align-items: center;
              color: #585a5a;
            `}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* 新增 */}
            <span className={widget}>
              <Button className={btn} type="text" disabled>
                <div
                  style={{
                    fontSize: 18,
                  }}
                  className={icon}
                >
                  <CirclePlus size={18} />
                </div>
              </Button>
            </span>
            {/* 分割线 */}
            <Divider />
            {/* 撤销 */}
            <span className={widget}>
              <Tooltip arrow={false} title="撤销">
                <Button className={btn} type="text" onClick={undo}>
                  <Undo2 size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 恢复 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={slate?.history.redos.length ? '重做' : ''}
              >
                <Button
                  className={btn}
                  type="text"
                  disabled={!slate?.history.redos.length}
                  onClick={redo}
                >
                  <Redo2 size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 分割线 */}
            <Divider />
            {/* 正文和标题 */}
            <TextAndTitle />
            {/* 字号调整 */}
            <FontSize />
            {/* 加粗 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>加粗</span>
                    <br />
                    <span>Ctrl + B</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isBold(marks)}
                  type="text"
                  onClick={bold}
                >
                  <Bold size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 斜体 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>斜体</span>
                    <br />
                    <span>Ctrl + I</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isItalic(marks)}
                  type="text"
                  onClick={italic}
                >
                  <Italic size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 删除线 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>删除线</span>
                    <br />
                    <span>Ctrl + X</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isStrikethrough(marks)}
                  type="text"
                  onClick={strikethrough}
                >
                  <Strikethrough size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 下划线 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>下划线</span>
                    <br />
                    <span>Ctrl + U</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isUnderline(marks)}
                  type="text"
                  onClick={underline}
                >
                  <Underline size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 行内代码块 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>行内代码</span>
                    <br />
                    <span>Ctrl + E</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isLineCode(marks)}
                  type="text"
                  onClick={linecode}
                >
                  <Code size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 分割线 */}
            <Divider />
            {/* 字体颜色 */}
            <FontColor />
            {/* 背景颜色 */}
            <BgColor />
            {/* 分割线 */}
            <Divider />
            {/* 对齐方式 */}
            <Align />
            {/* 无序列表 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>无序列表</span>
                    <br />
                    <span>Ctrl + 8</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isBulletedList(editorState)}
                  type="text"
                  onClick={bulletedListClick}
                >
                  <List size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 有序列表 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>有序列表</span>
                    <br />
                    <span>Ctrl + 7</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isNumberedList(editorState)}
                  type="text"
                  onClick={numberedListClick}
                >
                  <ListOrdered size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 行高调整 */}
            <LineHeight />
            {/* 分割线 */}
            <Divider />
            {/* 链接 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>插入链接</span>
                    <br />
                    <span>Ctrl + K</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isLink(marks)}
                  type="text"
                  onClick={linkClick}
                >
                  <Link size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 插入引用 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>插入引用</span>
                    <br />
                    <span>Ctrl + U</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isQuote(editorState)}
                  type="text"
                  onClick={quoteClick}
                >
                  <TextQuote size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 插入分割线 */}
            <span className={widget}>
              <Tooltip
                arrow={false}
                title={
                  <>
                    <span>插入分割线</span>
                    <br />
                    <span>Alt + Ctrl + S</span>
                  </>
                }
              >
                <Button
                  className={btn}
                  data-actived={isDividing(editorState)}
                  type="text"
                  onClick={dividingClick}
                >
                  <Minus size={18} />
                </Button>
              </Tooltip>
            </span>
            {/* 分割线 */}
            <Divider />
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;

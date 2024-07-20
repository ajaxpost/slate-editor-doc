import { FC, ReactNode } from 'react';
import { css } from '@emotion/css';
import { Resizable, ResizeCallback } from 're-resizable';
import { contextType, SlateElement, useReadOnly } from '@slate-doc/core';
import { ReactEditor } from 'slate-react';
import { Editor, Element, Path, Transforms } from 'slate';
import { useTableState } from '../context/table-context';

interface IProps {
  children: ReactNode;
  context: contextType;
}

const TableCell: FC<IProps> = ({ children, context }) => {
  const { widths, setWidths } = useTableState();
  const readOnly = useReadOnly();
  const onResize: ResizeCallback = (event, direction, ref) => {
    const slate = context.editorState.slate;
    if (!slate || !slate.selection) return;
    const width = ref.offsetWidth;
    let path: Path = [];
    try {
      path = ReactEditor.findPath(slate, context.props.element);
    } catch (error) {
      const nodes = Editor.nodes(slate, {
        at: [],
        match: (n) => {
          return (
            Element.isElement(n) &&
            Editor.isBlock(slate, n) &&
            !!n['table-cell'] &&
            n.cellId === context.props.element.cellId
          );
        },
      });
      for (const [node, _path] of nodes) {
        if (!node['table-cell']) return;
        path = _path;
      }
    }

    const index = path[path.length - 1];
    const newWidths = [...widths];
    newWidths[index] = width;
    setWidths(newWidths);
  };

  const onResizeStop: ResizeCallback = (event, direction, ref) => {
    const slate = context.editorState.slate;
    if (!slate || !slate.selection) return;
    let path: Path = [];
    try {
      path = ReactEditor.findPath(slate, context.props.element);
    } catch (error) {
      const nodes = Editor.nodes(slate, {
        at: [],
        match: (n) => {
          return (
            Element.isElement(n) &&
            Editor.isBlock(slate, n) &&
            !!n['table-cell'] &&
            n.cellId === context.props.element.cellId
          );
        },
      });
      for (const [node, _path] of nodes) {
        if (!node['table-cell']) return;
        path = _path;
      }
    }
    const nodes = Editor.nodes<SlateElement>(slate, {
      at: path,
      mode: 'highest',
      match: (n) => {
        return Element.isElement(n) && Editor.isBlock(slate, n) && !!n['table'];
      },
    });
    let parentPath: number[] = [];
    for (const [_node, _path] of nodes) {
      if (!_node['table']) return;
      parentPath = _path;
    }
    Transforms.setNodes(
      slate,
      {
        'table-cols-width': widths,
      },
      {
        at: parentPath,
      }
    );

    ReactEditor.focus(slate);
  };
  return (
    <td
      className={css`
        border: 1px solid #c9cdd4;
        box-sizing: border-box;
        min-width: 100px;
        padding: 0 5px;
        position: relative;
        vertical-align: top;
        word-break: break-word;
        user-select: none;
      `}
      colSpan={1}
      rowSpan={1}
    >
      <Resizable
        size={{
          width: 'auto',
          height: 'auto',
        }}
        onResize={onResize}
        onResizeStop={onResizeStop}
        handleComponent={{
          right: (
            <div
              contentEditable={false}
              className={css`
                background-color: transparent;
                bottom: 0;
                cursor: col-resize;
                position: absolute;
                right: -3px;
                top: 0;
                user-select: none;
                width: 6px;
                z-index: 10;
              `}
            ></div>
          ),
        }}
        resizeRatio={0.8}
        enable={{
          right: !readOnly,
        }}
      >
        {children}
      </Resizable>
    </td>
  );
};

export default TableCell;

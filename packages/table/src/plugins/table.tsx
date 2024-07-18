import { contextType, EditorPlugin, Plugin } from '@slate-doc/core';
import { create } from '../opts/create';
import TableCpt from '../components/table';
import TableRow from '../components/table-row';
import TableCell from '../components/table-cell';
import { css } from '@emotion/css';
import { onKeyDown } from '../event/onKeyDown';

const TableRender = (context: contextType) => {
  const table = context.props.element['table'];
  const row = context.props.element['table-row'];
  const cell = context.props.element['table-cell'];
  if (table) {
    const colsWidth = context.props.element['table-cols-width'] as number[];
    return <TableCpt colsWidth={colsWidth}>{context.children}</TableCpt>;
  }
  if (row) {
    context.plain = true;
    return <TableRow>{context.children}</TableRow>;
  }
  if (cell) {
    context.plain = true;
    return (
      <TableCell context={context}>
        <div
          className={css`
            margin: 8px 0;
          `}
        >
          {context.children}
        </div>
      </TableCell>
    );
  }
  return context.children;
};

const Table = new EditorPlugin({
  type: 'table',
  elements: {
    render: TableRender,
    props: {
      nodeType: 'block',
      rows: 3,
      cols: 3,
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: [],
    embedded: false,
    create: create('table'),
    hotkey: ['mod+p'],
    match(context) {
      return (
        !!context.props.element['table'] ||
        !!context.props.element['table-row'] ||
        !!context.props.element['table-cell']
      );
    },
  },
} as Plugin);

export { Table };

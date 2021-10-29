/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/display-name */

import React, { useEffect, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Table } from 'reactstrap';
import fse from 'fs-extra';
import path from 'path';
import { ipcRenderer } from 'electron';
import { arvisSnippetCollectionPath } from '@config/path';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { OuterContainer } from './components';
import { EditableCell } from './editableCell';
import { filenamifyPath, snippetInfoChangeHandler } from '../utils';

type IProps = {
  snippets?: SnippetItem[];
  reloadSnippets: () => void;
  collectionInfo?: SnippetCollectionInfo;
  snippetTableDoubleClickHandler: (idx: number) => void;
};

function SnippetTable({
  columns,
  data,
  updateSnippet,
  collectionInfo,
  snippetTableDoubleClickHandler,
}: {
  columns: any;
  data: SnippetItem[];
  updateSnippet: any;
  collectionInfo?: SnippetCollectionInfo;
  snippetTableDoubleClickHandler: (idx: number) => void;
}) {
  const dataRef = useRef<any>(data);
  const collectionInfoRef =
    useRef<SnippetCollectionInfo | undefined>(collectionInfo);

  const defaultColumn = React.useMemo(
    () => ({
      Cell: (cellArgs: any) => {
        const snippetIdx = cellArgs.row.index;
        if (!dataRef.current[snippetIdx]) return null;
        const { type } = dataRef.current[snippetIdx];

        return EditableCell({
          ...cellArgs,
          type,
          options: {
            collectionInfo: collectionInfoRef.current,
            onDoubleClickHandler: () =>
              snippetTableDoubleClickHandler(snippetIdx),
          },
        });
      },
    }),
    [data, collectionInfo]
  );

  const onContextMenuHandler = (rowInfo: any) => {
    const rowIdx = rowInfo.index;
    const rowData = data[rowIdx];

    ipcRenderer.send(IPCRendererEnum.popupSnippetItemMenu, {
      snippetItemStr: JSON.stringify(rowData),
    });
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        updateSnippet,
      },
      useSortBy
    );

  useEffect(() => {
    dataRef.current = data;
    collectionInfoRef.current = collectionInfo;
  });

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                style={{
                  color: '#fff',
                }}
                {...column.getHeaderProps(
                  (column as any).getSortByToggleProps()
                )}
              >
                {column.render('Header')}
                <span style={{ fontSize: 10 }}>
                  {(column as any).isSorted
                    ? (column as any).isSortedDesc
                      ? ' ▼'
                      : ' ▲'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              onContextMenu={() => onContextMenuHandler(row)}
            >
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default function (props: IProps) {
  const {
    snippets,
    reloadSnippets,
    collectionInfo,
    snippetTableDoubleClickHandler,
  } = props;

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'A->',
        accessor: 'useAutoExpand',
      },
      {
        Header: 'Keyword',
        accessor: 'keyword',
      },
      {
        Header: 'Snippet',
        accessor: 'snippet',
      },
    ],
    []
  );

  const snippetNameChangeHandler = (snippet: SnippetItem, value: string) => {
    // Update snippet by changing file name
    const oldFileName = filenamifyPath(`${snippet.name} [${snippet.uid}].json`);
    const newFileName = filenamifyPath(`${value} [${snippet.uid}].json`);

    const oldPath = path.resolve(
      arvisSnippetCollectionPath,
      snippet.collection,
      oldFileName
    );

    const newPath = path.resolve(
      arvisSnippetCollectionPath,
      snippet.collection,
      newFileName
    );

    return fse.rename(oldPath, newPath);
  };

  const updateSnippet = (
    rowIndex: number,
    columnId: string,
    value: string | boolean
  ) => {
    const snippet = snippets![rowIndex];

    snippetInfoChangeHandler(snippet, columnId, value).then(() => {
      if (columnId === 'name') {
        snippetNameChangeHandler(snippet, value as string)
          .then(reloadSnippets)
          .catch(console.error);
      } else {
        reloadSnippets();
      }

      return null;
    });
  };

  return (
    <OuterContainer>
      <SnippetTable
        columns={columns}
        data={snippets ?? []}
        updateSnippet={updateSnippet}
        collectionInfo={collectionInfo}
        snippetTableDoubleClickHandler={snippetTableDoubleClickHandler}
      />
    </OuterContainer>
  );
}

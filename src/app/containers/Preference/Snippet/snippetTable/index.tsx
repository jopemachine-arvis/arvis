/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/display-name */

import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useTable, useSortBy } from 'react-table';
import { Table } from 'reactstrap';
import styled from 'styled-components';
import fse from 'fs-extra';
import path from 'path';
import { arvisSnippetCollectionPath } from '@config/path';
import { EditableCell } from './editableCell';

const OuterContainer = styled.div`
  width: 95%;
  height: 100%;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 10px;

  overflow-x: hidden;
  overflow-y: auto !important;

  tbody {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto !important;
  }

  td:nth-child(1) {
    min-width: 90px;
    width: 12%;
  }

  td:nth-child(2) {
    min-width: 110px;
    width: 4%;
  }

  td:nth-child(3) {
    width: 18%;
  }

  table {
    color: #888;
    border-color: #333;

    th,
    td {
      margin: 0;
      padding: 0.5rem;

      text-align: center;
      white-space: nowrap;

      input {
        width: 100%;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 3;
        padding-right: 3;
        margin: 0;
        border: 0;
        background-color: #202228;
      }
    }
  }
`;

function SnippetTable({
  columns,
  data,
  updateSnippet,
}: {
  columns: any;
  data: any;
  updateSnippet: any;
}) {
  const dataRef = useRef<any>(data);

  const defaultColumn = React.useMemo(
    () => ({
      Cell: (cellArgs: any) => {
        if (!dataRef.current[cellArgs.row.index]) return null;
        const { type } = dataRef.current[cellArgs.row.index];
        return EditableCell({ type, ...cellArgs });
      },
    }),
    [data]
  );

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
            <tr {...row.getRowProps()}>
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

type IProps = {
  snippets: SnippetItem[];
  reloadSnippets: () => void;
};

export default function (props: IProps) {
  const { snippets, reloadSnippets } = props;

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'A->',
        accessor: 'A->',
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
    const oldPath = path.resolve(arvisSnippetCollectionPath, snippet.name);
    const newPath = path.resolve(arvisSnippetCollectionPath, value);
    fse.rename(oldPath, newPath);
  };

  const snippetInfoChangeHandler = (
    snippet: SnippetItem,
    target: string,
    value: string
  ) => {
    // Update snippet by updating json file
    const snippetPath = path.resolve(arvisSnippetCollectionPath, snippet.name);
    const data: Record<string, any> = {
      snippet: snippet.snippet,
      dontautoexpand: !snippet.useAutoExpand,
      name: snippet.name,
      keyword: snippet.keyword,
    };

    if (snippet.uid) {
      data.uid = snippet.uid;
    }

    data[target] = value;

    fse.writeJson(snippetPath, data, { encoding: 'utf8' });
  };

  const updateSnippet = (rowIndex: number, columnId: string, value: string) => {
    const snippet = snippets[rowIndex];

    if (columnId === 'name') {
      snippetNameChangeHandler(snippet, value);
    } else {
      snippetInfoChangeHandler(snippet, columnId, value);
    }

    reloadSnippets();
  };

  return (
    <OuterContainer>
      {snippets.length > 0 && (
        <SnippetTable
          columns={columns}
          data={snippets}
          updateSnippet={updateSnippet}
        />
      )}
    </OuterContainer>
  );
}

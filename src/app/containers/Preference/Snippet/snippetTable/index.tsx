/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/display-name */

import React, { useEffect, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Table } from 'reactstrap';
import fse from 'fs-extra';
import path from 'path';
import { arvisSnippetCollectionPath } from '@config/path';
import filenamify from 'filenamify';
import { OuterContainer } from './components';
import { EditableCell } from './editableCell';

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

  const removeMultipleSpace = (str: string) => {
    return str.replace(/\s\s+/g, ' ');
  };

  const snippetNameChangeHandler = (snippet: SnippetItem, value: string) => {
    // Update snippet by changing file name
    const oldFileName = removeMultipleSpace(
      filenamify(
        snippet.uid
          ? `${snippet.name} [${snippet.uid}].json`
          : `${snippet}.json`,
        { replacement: '' }
      )
    );

    const newFileName = removeMultipleSpace(
      filenamify(`${value}.json`, { replacement: '' })
    );

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

  const snippetInfoChangeHandler = (
    snippet: SnippetItem,
    target: string,
    value: string | boolean
  ) => {
    // Update snippet by updating json file
    const snippetFileName = removeMultipleSpace(
      filenamify(
        snippet.uid
          ? `${snippet.name} [${snippet.uid}].json`
          : `${snippet}.json`,
        { replacement: '' }
      )
    );

    const snippetPath = path.resolve(
      arvisSnippetCollectionPath,
      snippet.collection,
      snippetFileName
    );

    const data: Record<string, any> = {
      snippet: snippet.snippet,
      dontautoexpand: !snippet.useAutoExpand,
      name: snippet.name,
      keyword: snippet.keyword,
    };

    if (snippet.uid) {
      data.uid = snippet.uid;
    }

    if (target === 'useAutoExpand') {
      data.dontautoexpand = value;
    } else {
      data[target] = value;
    }

    return fse.writeJson(
      snippetPath,
      { arvissnippet: data },
      { encoding: 'utf8', spaces: 4 }
    );
  };

  const updateSnippet = (
    rowIndex: number,
    columnId: string,
    value: string | boolean
  ) => {
    const snippet = snippets[rowIndex];

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

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useTable, useSortBy } from 'react-table';
import { Table } from 'reactstrap';
import styled from 'styled-components';
import { Core } from 'arvis-core';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
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
    width: 22%;
  }

  td:nth-child(3) {
    width: 66%;
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

const transformData = (trigger: any) => {
  let desc;
  if (trigger.type === 'hotkey') {
    desc = trigger.actions[0] ? trigger.actions[0].title : '';
  } else {
    desc = trigger.title || trigger.subtitle || '';
  }

  return {
    type: trigger.type,
    command: trigger.hotkey || trigger.command || '',
    triggerPath: trigger.triggerPath,
    description: desc,
  };
};

function TriggerTable({
  bundleId,
  columns,
  data,
  updateJson,
}: {
  bundleId: string;
  columns: any;
  data: any;
  updateJson: any;
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
        updateJson,
      },
      useSortBy
    );

  const onContextMenuHandler = (rowInfo: any) => {
    const rowIdx = rowInfo.index;
    const rowData = data[rowIdx];

    ipcRenderer.send(IPCRendererEnum.popupWorkflowTriggerTableItem, {
      bundleId,
      triggerPath: rowData.triggerPath,
      workflowInfo: JSON.stringify(Core.getWorkflowList()[bundleId]),
    });
  };

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

export function WorkflowTriggerTable(props: any) {
  const { bundleId, triggers } = props;

  const data = React.useMemo(
    () => (triggers ? triggers.map(transformData) : []),
    [triggers]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Command',
        accessor: 'command',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
    ],
    []
  );

  const updateJson = (rowIndex: number, _columnId: number, value: string) => {
    const { triggerPath } = data[rowIndex];

    // To do:: Below logic needs to be removed after chokidar's symlink issue is resolved
    // Because followSymlink is false now, below logic is needed for now.
    Core.updateWorkflowTrigger(bundleId, triggerPath, value)
      .then(() => {
        ipcRenderer.send(IPCRendererEnum.reloadWorkflow, {
          destWindow: 'searchWindow',
          bundleId,
        });
        ipcRenderer.send(IPCRendererEnum.reloadWorkflow, {
          destWindow: 'preferenceWindow',
          bundleId,
        });
        return null;
      })
      .catch(console.error);
  };

  return (
    <OuterContainer>
      {data.length > 0 && (
        <TriggerTable
          columns={columns}
          data={data}
          updateJson={updateJson}
          bundleId={bundleId}
        />
      )}
    </OuterContainer>
  );
}

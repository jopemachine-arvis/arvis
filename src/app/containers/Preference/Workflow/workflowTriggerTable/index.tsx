/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useTable, useSortBy } from 'react-table';
import { Table } from 'reactstrap';
import { Core } from 'arvis-core';
import { ipcRenderer } from 'electron';
import { IPCRendererEnum } from '@ipc/ipcEventEnum';
import { EditableCell } from './editableCell';
import { OuterContainer } from './components';

const transformData = (trigger: Command) => {
  let desc;
  if (trigger.type === 'hotkey') {
    desc = trigger.actions![0]
      ? (trigger.actions![0] as KeywordAction | ScriptFilterAction).title
      : '';
  } else {
    desc = trigger.title || trigger.subtitle || '';
  }

  return {
    type: trigger.type,
    command: trigger.hotkey || trigger.command || '',
    triggerPath: (trigger as any).triggerPath,
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

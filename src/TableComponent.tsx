import React, { useEffect } from "react";
import {
  Column,
  useTable,
  usePagination,
  useRowSelect,
  useSortBy,
  useRowState,
} from "react-table";
import { Data, ApiRequest } from "./App";
import {
  TableFooter,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TablePagination,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import TablePaginationActions from "./TablePaginationActions";

interface Props {
  data: ApiRequest;
  apiPage: number;
  pageSize: number;
  columns: Column<Data>[];

  setSelectedRowCallback: (selectedRows: Data[]) => void;
  getCellProps: (cell: Column<Data>) => {
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  };
  getCellHeaderProps: (cell: Column<Data>) => {
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  };
  getRowProps: (row: Data) => {
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    isSelected?: boolean;
  };
  setApiPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const TableComponent = (props: Props) => {
  const {
    columns,
    data,
    setSelectedRowCallback,
    apiPage,
    pageSize,
    setApiPage,
    setPageSize,
    getCellProps,
    getCellHeaderProps,
    getRowProps,
  } = props;
  const memoData = React.useMemo(() => data.data, [data]);
  const tableInstance = useTable(
    {
      columns,
      data: memoData,
      initialState: {},
      pageCount: data.totalPages,
      manualPagination: true,
    },
    useRowState,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          disableSortBy: true,
          maxWidth: 50,
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <Checkbox
                // checked={getToggleAllRowsSelectedProps().checked}
                {...getToggleAllRowsSelectedProps()}
                title="Select all rows"
              />
            );
          },
          Cell: ({ row }) => {
            return (
              <Checkbox
                // checked={row.getToggleRowSelectedProps().checked}
                {...row.getToggleRowSelectedProps()}
                title="Select row"
              />
            );
          },
        },
        ...columns,
        {
          id: "actions",
          Header: "Actions",
          disableSortBy: true,
          maxWidth: 50,
          Cell: ({ row }) => {
            return <div>Actions</div>;
          },
        },
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    selectedFlatRows,
    state: { selectedRowIds },
  } = tableInstance;

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: any
  ) => {
    setApiPage(page);
  };

  const handelChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setApiPage(0);
  };

  useEffect(() => {
    const selectedRows = selectedFlatRows.map((row) => row.original);
    setSelectedRowCallback(selectedRows);
  }, [selectedFlatRows, setSelectedRowCallback]);

  return (
    <TableContainer
      sx={{
        width: "100%",
      }}
    >
      <Table size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <TableCell
                    {...column.getHeaderProps([
                      column.getSortByToggleProps(),
                      getCellHeaderProps(column),
                    ])}
                  >
                    {column.render("Header")}
                    <TableSortLabel
                      active={column.isSorted}
                      hideSortIcon={column.disableSortBy}
                      direction={
                        column.isSorted
                          ? column.isSortedDesc
                            ? "desc"
                            : "asc"
                          : "asc"
                      }
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps(getRowProps(row))}>
                {row.cells.map((cell: any) => {
                  return (
                    <TableCell {...cell.getCellProps(getCellProps(cell))}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, { label: "All", value: -1 }]}
              colSpan={columns.length + 2}
              count={data.totalPassengers}
              page={apiPage}
              rowsPerPage={pageSize}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handelChangeRowsPerPage}
              // SelectProps={{
              //   inputProps: { "aria-label": "rows per page" },
              //   native: true,
              // }}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRows[].original": selectedFlatRows.map(
                (d) => d.original
              ),
            },
            null,
            2
          )}
        </code>
      </pre>
    </TableContainer>
  );
};

export default TableComponent;

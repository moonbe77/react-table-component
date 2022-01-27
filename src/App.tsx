import "./styles.css";
import TableComponent from "./TableComponent";
import { styled } from "@mui/system";
import { ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";
import React, { useState, useCallback } from "react";
import { Column } from "react-table";
import theme from "./theme";

export interface ApiRequest {
  data: Data[];
  totalPassengers: number;
  totalPages: number;
}
export interface RowState {
  cellStates: { [key: string]: boolean };
  isHighlighted: boolean;
}
export interface Data {
  [key: string]: any;
}

const TableWrapper = styled("div")({
  width: "100%",
  padding: 16,
  overflow: "auto",
  height: " 80vh",
});

export default function App() {
  const [data, setData] = useState<ApiRequest | undefined>();
  const [apiPage, setApiPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = React.useMemo<Column<Data>[]>(
    () => [
      {
        Header: "id",
        accessor: "_id",
        maxWidth: 50,
      },
      {
        Header: "Name",
        accessor: "name",
        maxWidth: 50,
      },
      {
        Header: "Trips",
        accessor: "trips",
        maxWidth: 50,
      },
    ],
    []
  );

  React.useEffect(() => {
    fetch(
      `https://api.instantwebtools.net/v1/passenger?page=${apiPage}&size=${pageSize}`
    )
      .then((res: any) => {
        return res.json();
      })
      .then((res: ApiRequest) => {
        setData(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [apiPage, pageSize]);

  const getCellProps = (cell: any) => {
    // returns the props for the cell
    console.log(cell);
    const isSelectionRow = cell.column.id === "selection";
    return {
      style: {},
      padding: isSelectionRow ? "checkbox" : "none",
      sx: {
        maxWidth: cell.column.maxWidth,
      },
    };
  };

  const getCellHeaderProps = (column: any) => {
    // returns the props for the cell
    const isSelectionRow = column.id === "selection";
    return {
      style: {},
      padding: isSelectionRow ? "checkbox" : "none",
      sx: {
        maxWidth: column.maxWidth,
      },
    };
  };

  const getRowProps = (row: any) => {
    // returns an object with the props you want to pass to the row
    return {
      style: {
        cursor: "pointer",
        backgroundColor: row.isSelected
          ? orange[500]
          : row.state.isHighlighted
          ? orange[50]
          : "",
      },
      onClick: () => {
        row.setState((prev: RowState) => {
          return {
            ...prev,
            isHighlighted: !prev.isHighlighted,
          };
        });
      },
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setSelectedRowCallback = useCallback((rowsSelected) => {
    setSelectedRows(rowsSelected);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <TableWrapper>
          {data && (
            <TableComponent
              columns={columns}
              data={data}
              setSelectedRowCallback={setSelectedRowCallback}
              apiPage={apiPage}
              pageSize={pageSize}
              setApiPage={setApiPage}
              setPageSize={setPageSize}
              getCellProps={getCellProps}
              getCellHeaderProps={getCellHeaderProps}
              getRowProps={getRowProps}
            />
          )}
        </TableWrapper>
      </div>
    </ThemeProvider>
  );
}

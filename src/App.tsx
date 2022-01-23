import "./styles.css";
import TableComponent from "./TableComponent";
import { styled } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";
import React, { useState, useCallback } from "react";
import { Column } from "react-table";

export interface ApiRequest {
  data: Data[];
  totalPassengers: number;
  totalPages: number;
}

export interface Data {
  [key: string]: any;
}

const theme = createTheme({
  // status: {
  //   danger: orange[500],
  // },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          // backgroundColor: orange[50],
        },
      },
    },
  },
});

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
  const [highlightedRow, setHighlightedRow] = useState<number | undefined>();

  console.log(selectedRows);

  const columns = React.useMemo<Column<Data>[]>(
    () => [
      {
        Header: "id",
        accessor: "_id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Trips",
        accessor: "trips",
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
    return {
      style: {
        // backgroundColor: cell.value === "Pedro" ? orange[50] : "",
      },
    };
  };

  const getRowProps = (row: any) => {
    // returns an object with the props you want to pass to the row
    const isHighlighted = highlightedRow === row.index;
    return {
      style: {
        cursor: "pointer",
        backgroundColor: row.isSelected || isHighlighted ? orange[500] : "",
      },
      onClick: () => {
        if (isHighlighted) {
          setHighlightedRow(undefined);
        } else {
          setHighlightedRow(row.index);
        }
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
              setHighlightedRow={setHighlightedRow}
              apiPage={apiPage}
              pageSize={pageSize}
              setApiPage={setApiPage}
              setPageSize={setPageSize}
              getCellProps={getCellProps}
              getRowProps={getRowProps}
            />
          )}
        </TableWrapper>
      </div>
    </ThemeProvider>
  );
}

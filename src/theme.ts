import { createTheme } from "@mui/material";
import * as colors from "@mui/material/colors";
console.log(colors);

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme(
  {
    // status: {
    //   danger: orange[500],
    // },
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            // backgroundColor: colors.blue[400],
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: colors.blue[700],
            color: colors.grey[50],
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: colors.blue[50],
            },
          },
          head: {
            "&:hover": {
              backgroundColor: "unset",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            maxWidth: "150px",
          },
          head: {
            padding: "0.5rem 0",
            color: colors.blue[50],
          },
          body: {
            padding: "0.5rem 0",
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          icon: {
            "&.MuiTableSortLabel-iconDirectionDesc": {
              color: colors.blue[100],
            },
            "&.MuiTableSortLabel-iconDirectionAsc": {
              color: colors.blue[100],
            },
          },
        },
      },
    },
  },
  {
    typography: {
      useNextVariants: true,
    },
  }
);

export default theme;

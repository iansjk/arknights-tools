import { createTheme } from "@mui/material";
import { pink, blue, grey } from "@mui/material/colors";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    grey: true;
  }
}

declare module "@mui/material" {
  interface Color {
    main: string;
    dark: string;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[800],
    },
    secondary: {
      main: pink[100],
    },
    background: {
      paper: grey[900],
    },
    grey: {
      main: grey[300],
      dark: grey[400],
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#fff",
          },
        },
      },
    },
  },
});
export default theme;

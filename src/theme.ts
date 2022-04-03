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
      main: blue[700],
      light: "rgb(104, 179, 255)",
      dark: "#303f9f",
      contrastText: "#fff",
    },
    secondary: {
      main: pink[100],
    },
    background: {
      default: "#303030",
      paper: "#424242",
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

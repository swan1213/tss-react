import { render } from "react-dom";
//NOTE: If makeStyles was located in src/app we would write: import { makeStyles } from "app/makeStyles";
import { useStyles, muiCache } from "makeStyles";
import { App } from "./App";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createTheme({
    "palette": {
        "primary": {
            "main": "#32CD32"
        }
    }
});


function Root() {

    const { css } = useStyles();

    return <App className={css({ "boxShadow": "10px 5px 5px teal" })} />;

}

render(
    <CacheProvider value={muiCache}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Root />
        </MuiThemeProvider>
    </CacheProvider>,
    document.getElementById("root")
);
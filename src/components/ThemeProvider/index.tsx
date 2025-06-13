import { theme } from "antd";
import React from "react";
import { ThemeProvider } from "styled-components";
import { breakpoints, extraThemeVars } from '../../theme';

const CustomThemeProvider = ({ children }: React.PropsWithChildren) => {
    const { token } = theme.useToken();

    return (
        <ThemeProvider theme={{ systemDefaults: token, breakpoints, ...extraThemeVars }}>
            {children}
        </ThemeProvider>
    );
}
export default CustomThemeProvider

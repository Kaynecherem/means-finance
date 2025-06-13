import { ThemeConfig } from "antd"

export const theme: ThemeConfig = {
    token: {
        fontFamily: 'Inter',
        colorPrimary: '#0E8737',
        colorPrimaryBg: "#C4E1CD",
        colorFillSecondary: "rgba(14, 135, 55,0.06)",
        colorError: "#D92D20",
        colorErrorBg: "#FEF3F2",
    }
}

export const extraThemeVars = {
    navigationMenuTextColor: "#667085",
    color900: "#101828",
    color800: "#1D2939",
    color700: "#344054",
    color600: "#4A5578",
    color500: "#667085",
    color300: "#D0D5DD",
    color200: "#EAECF0",
    color100: "#F2F4F7",
    color50: "#F9FAFB",
    color25: "#FCFCFD",
    colorFillCustom: "rgba(14, 135, 55,0.1)",
    colorError500: "#F04438",
    colorError100: "#FEE4E2",
    colorError50: "#FEF3F2",
    colorSuccess600: "#039855",
    colorSuccess500: "#12B76A",
    colorSuccess100: "#D1FADF",
    colorSuccess50: "#ECFDF3",
    grayWarm500: "#57534E"

}
export const breakpoints = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
}

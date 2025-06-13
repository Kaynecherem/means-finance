import styled, { DefaultTheme } from "styled-components";
import { FormIconColor, FormIconProps, FormIconSize } from ".";
const getSizeParams = (size?: FormIconSize) => {
    if (size === 'large') {
        return {
            height: '100px',
            width: '100px',
            fontSize: '60px',
            outline: '10px'
        }
    } else {
        return {
            height: '28px',
            width: '28px',
            fontSize: '15px',
            outline: '6px'
        }
    }
}

const getColors = (theme: DefaultTheme, color?: FormIconColor) => {
    switch (color) {
        case 'success':
            return {
                outline: theme.colorSuccess50,
                background: theme.colorSuccess100,
                font: theme.colorSuccess600
            }
        case 'danger':
            return {
                outline: theme.systemDefaults.colorErrorBg,
                background: theme.colorError100,
                font: theme.systemDefaults.colorError
            }
        default:
            return {
                outline: theme.systemDefaults.colorFillSecondary,
                background: theme.systemDefaults.colorPrimaryBg,
                font: theme.systemDefaults.colorPrimary
            }
    }
}

export const FormIconWrapper = styled.div<FormIconProps>`
    height: ${props => getSizeParams(props.size).height};
    width: ${props => getSizeParams(props.size).width};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => getSizeParams(props.size).fontSize};
    border-radius: 50%;
    outline: ${props => getSizeParams(props.size).outline} solid ${({ theme, color }) => getColors(theme, color).outline};
    background-color: ${({ theme, color }) => getColors(theme, color).background};
    color: ${({ theme, color }) => getColors(theme, color).font};
    margin:6px;
`

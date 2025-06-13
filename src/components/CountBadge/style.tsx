import styled, { DefaultTheme } from "styled-components";
import { CountBadgeProps, CountBadgeType } from ".";

const getColors = (theme: DefaultTheme, type?: CountBadgeType) => {
    switch (type) {
        case 'primary':
            return {
                backgroundColor: theme.colorSuccess50,
                fontColor: theme.colorSuccess500
            }
        case 'danger':
            return {
                backgroundColor: theme.colorError50,
                fontColor: theme.colorError500
            }

        default:
            return {
                backgroundColor: theme.color200,
                fontColor: theme.color500
            }
    }
}

export const StyledCountBadge = styled.div<CountBadgeProps>`
    padding: 2px 6px;
    margin-left: 4px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    text-align: center;
    background-color: ${({ theme, type }) => getColors(theme, type).backgroundColor};
    color: ${({ theme, type }) => getColors(theme, type).fontColor};

`

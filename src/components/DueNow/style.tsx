import styled, { DefaultTheme } from "styled-components";
import { DueNowProps, DueNowType } from ".";

const getColors = (theme: DefaultTheme, type?: DueNowType) => {
    if (type === 'danger') {
        return {
            iconBackgroundColor: theme.colorError100,
            amountColor: theme.colorError500
        }
    } else {
        return {
            iconBackgroundColor: theme.colorSuccess100,
            amountColor: theme.colorSuccess500
        }
    }
}

export const StyledDueNow = styled.div<DueNowProps>`
    display: flex;
    box-shadow: 0px 1px 3px 0px #1018281A;
    padding: 12px 16px;
    border-radius: 8px;
    column-gap: 16px;
    width: 350px;
    margin: 0 auto;
    & .icon-wrapper{
        & .icon{
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: ${({ theme, type }) => getColors(theme, type).iconBackgroundColor};
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    & .content-wrapper{
        padding-top: 4px;
        & .title{
            font-size: 18px;
            font-weight: 500;
            line-height: 28px;
            color: ${({ theme }) => theme.color900};
        }
        & .amount-wrapper{
            margin-top:1px;
            color: ${({ theme, type }) => getColors(theme, type).amountColor};
            display: flex;
            align-items: center;
            & .currency{
                font-size: 36px;
                font-weight: 600;
                line-height: 44px;
                letter-spacing: -0.02em;
                margin-right: 2px;
            }
            & .number{
                font-size: 48px;
                font-weight: 600;
                line-height: 60px;
                letter-spacing: -0.02em;
            }
        }
    }
`

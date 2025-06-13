import { css } from "styled-components";

export const commonFieldBase = css`
    padding: 10px 14px;
    border-radius: 8px;
    text-align: left;
    width: -moz-available;          /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    width: fill-available;
    color: ${({ theme }) => theme.color900};
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    
    &:not(.ant-input-outlined:focus-within):not(.ant-input-number-outlined:focus-within){
        border-color: ${({ theme }) => theme.color300};
        box-shadow: 0px 1px 2px 0px #1018280D;
    }

    & input{
        padding: 0;
        color: ${({ theme }) => theme.color900};
        font-size: 16px;
        font-weight: 400;
    }
`

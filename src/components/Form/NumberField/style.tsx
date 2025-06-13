import { InputNumber } from "antd";
import styled from "styled-components";

export const StyledNumberField = styled(InputNumber)`
    padding: 0px 0px 0px 14px;
    border-radius: 8px;
    text-align: left;
    width: -moz-available;          /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    width: fill-available;
    color: ${({ theme }) => theme.color900};
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    line-height: 1;
    & .ant-input-number-input,& .ant-input-number-prefix{
        color: ${({ theme }) => theme.color900};
        font-size: 16px;
        font-weight: 400;
        line-height: 1;
    }
    & .ant-input-number-prefix{
        margin-right: 0;
    }
    & input{
        padding: 12px 0px;
    }
    &:not(.ant-input-outlined:focus-within):not(.ant-input-number-outlined:focus-within){
        border-color: ${({ theme }) => theme.color300};
    }
`

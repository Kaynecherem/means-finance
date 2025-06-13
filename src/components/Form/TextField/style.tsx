import { Input } from "antd";
import styled from "styled-components";

export const StyledTextField = styled(Input)`
    padding: 9px 14px;
    border-radius: 8px;
    text-align: left;
    color: ${({ theme }) => theme.color900};
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    line-height: 24px;
    
    &:not(.ant-input-outlined:focus-within):not(.ant-input-number-outlined:focus-within){
        border-color: ${({ theme }) => theme.color300};
        box-shadow: 0px 1px 2px 0px #1018280D;
    }
    & .ant-input-prefix{
    }
`

import { Button } from "antd";
import styled from "styled-components";

export const StyledCustomButton1 = styled(Button)`
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    padding: 9px;
    height:auto;
    border-radius: 8px;
    width: 100%;
     &.ant-btn-default{
        color: ${({ theme }) => theme.color800};
        background-color: white;
        border-color: ${({ theme }) => theme.color300};
   }
`

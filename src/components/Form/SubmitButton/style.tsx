import { Button } from "antd";
import styled from "styled-components";

export const StyledSubmitButton = styled(Button)`
    padding: 15px 28px;
    height:auto;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    border-radius: 8px;
    &.ant-btn-dangerous{
        color: ${({ theme }) => theme.systemDefaults.colorError};
        background-color: ${({ theme }) => theme.systemDefaults.colorErrorBg};
    }
   & .ant-btn-icon{
        font-size: 24px;
        display: flex;
   }
   &.ant-btn-default{
        color: ${({ theme }) => theme.color800};
        background-color: ${({ theme }) => theme.color50};
        border-color: ${({ theme }) => theme.color300};

   }
`

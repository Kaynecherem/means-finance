import { Radio } from "antd";
import styled from "styled-components";

export const TabSelectionRadioGroup = styled(Radio.Group)`
    background-color:${({ theme }) => theme.color50};
    border-radius: 8px;
    border:1px solid ${({ theme }) => theme.color100};
    padding: 4px;
    & .ant-radio-button-wrapper{
        background-color: transparent;
        border: none;
        color:${({ theme }) => theme.color500};
        font-size: 14px;
        font-weight: 500;
        padding: 8px 14px;
        line-height: 1;
        height: auto;
        border:1px solid transparent;
        &::before{
            content: none;
        }
        &.ant-radio-button-wrapper-checked{
            background-color:  ${({ theme }) => theme.systemDefaults.colorBgContainer};
            border-color:${({ theme }) => theme.color300};
            border-radius: 8px;
            color:${({ theme }) => theme.color700};
            box-shadow: 0px 1px 2px 0px #1018280D;
        }
    }
`


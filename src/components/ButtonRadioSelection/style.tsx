import { Radio } from "antd";
import styled from "styled-components";

export const ButtonSelectionRadioGroup = styled(Radio.Group)`
    & .ant-radio-button-wrapper{
        border-radius: 8px;
        padding: 13px 14px;
        height: auto;
        line-height: 1;
        font-size: 16px;
        font-weight: 500;
        margin: 0px 4px;
        color:${({ theme }) => theme.color700};
        border:1px solid  ${({ theme }) => theme.color300};
        &::before{
                content: none;
        }
        &.ant-radio-button-wrapper-checked{
            color:  ${({ theme }) => theme.systemDefaults.colorWhite};
        }
    }
`


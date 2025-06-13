import { Radio } from "antd";
import { RadioButtonProps } from "antd/es/radio/radioButton";
import styled from "styled-components";

export const StyledFullWidthTab = styled(Radio.Group) <RadioButtonProps>`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.color100};
    background-color: ${({ theme }) => theme.color25};
    border-radius: 8px;
    padding: 4px;
    & .ant-radio-button-wrapper{
        width: ${({ options }) => options?.length ? 100 / options.length : '100'}%;
        text-align: center;
        font-size: 20px;
        font-weight: 500;
        line-height: 30px;
        color: ${({ theme }) => theme.color500};
        border:1px solid transparent;
        border-radius: 8px;
        padding: 8px 14px;
        height: auto;
        background: transparent;
        &::before{
            display: none;
        }
        &.ant-radio-button-wrapper-checked{
            background-color: ${({ theme }) => theme.systemDefaults.colorPrimaryBg};
            border-color:  ${({ theme }) => theme.systemDefaults.colorPrimary};
            color:  ${({ theme }) => theme.systemDefaults.colorPrimary};
            box-shadow: 0px 1px 2px 0px #1018280D;
        }
    }

`

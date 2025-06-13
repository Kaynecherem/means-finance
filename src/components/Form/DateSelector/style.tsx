import { Checkbox } from "antd";
import styled from "styled-components";

export const StyledDateSelector = styled(Checkbox.Group<number>)`
    width: 292px;
    column-gap: 2px;
    row-gap: 2px;
    & .ant-checkbox-wrapper{
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.color700};
        font-size: 14px;
        line-height: 1;
        font-weight: 400;
        margin: 0;
        & .ant-checkbox{
            display: none;
        }
        &.ant-checkbox-wrapper-checked{
            border-radius: 50%;
            color: ${({ theme }) => theme.systemDefaults.colorWhite};
            background-color: ${({ theme }) => theme.systemDefaults.colorPrimary};
        }
    }
`

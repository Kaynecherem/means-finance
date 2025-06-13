import { Select } from "antd";
import styled from "styled-components";
import { StyledTextField } from "../TextField/style";

export const StyledPhoneFieldWrapper = styled.div`
position: relative;
`
export const StyledCountrySelect = styled(Select)`
    position: absolute;
    z-index: 1;
    width: 73px;
    height: calc(100% - 2px);
    top: 1px;
    left: 2px;
    & .ant-select-selector{
        border: none;
        outline: none;
        box-shadow: none;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        padding: 0px 13px;
        color: ${({ theme }) => theme.color900};

    }
    & .ant-select-arrow{
        font-size: 20px;
    color: ${({ theme }) => theme.color900};

    }
    &.ant-select-disabled {
        & .ant-select-selector{
            background-color: transparent;
        }
    }
`
export const StyledPhoneField = styled(StyledTextField)`
    padding-left: 74px;
`

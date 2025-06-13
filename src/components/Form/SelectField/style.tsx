import { Select } from "antd";
import styled from "styled-components";

export const StyledSelectField = styled(Select)`
height: auto;
& .ant-select-selector{
    /* padding: 10px 14px; */
    padding: 0;
    border-radius: 8px;
    text-align: left;
    width: -moz-available;          /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    width: fill-available;
    color: ${({ theme }) => theme.color900};
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    & .ant-select-selection-item, & .ant-select-selection-placeholder{
        padding: 13px 24px 13px 18px;
        color: ${({ theme }) => theme.color900};
        font-size: 16px;
        font-weight: 400;
        line-height: 1;
    }
    & .ant-select-selection-search{
        inset-inline-start:0;
        & input{
            padding: 13px 24px 13px 18px;
        color: ${({ theme }) => theme.color900};
        font-size: 16px;
        font-weight: 400;
        line-height: 1;
        }
    }
}
`

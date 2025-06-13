import { Input } from "antd";
import styled from "styled-components";

export const StyledSearchBox = styled(Input.Search)`
    padding: 0px;
    border-radius: 8px !important;
    text-align: left;
    width: -moz-available;          /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
    width: fill-available;
    color: ${({ theme }) => theme.color900};
    font-size: 16px;
    font-weight: 400;
    position: relative;
    & input{
        padding: 10px 14px;
        padding-right: 38px;
        border-radius: 8px !important;
    }
    &:not(.ant-input-outlined:focus-within):not(.ant-input-number-outlined:focus-within){
        border-color: ${({ theme }) => theme.color300};
        box-shadow: 0px 1px 2px 0px #1018280D;
    }
    & .ant-input-group-addon{
        position: absolute;
        inset-inline-start: 0px;
        border: none;
        background: transparent;
        padding: 0;
        top: 0;
        right: 0;
        left: auto;
        height: 100%;
        width: 38px;
        z-index: 1;
        display: flex;
        align-items: center;
        padding-left: 8px;
        & .ant-input-search-button{
            padding: 0;
            width: auto;
            height: auto;
            background: transparent;
            border: none;
            border-radius: 0;
            color: ${({ theme }) => theme.color500};
            font-size: 16px;
        }
    }
`

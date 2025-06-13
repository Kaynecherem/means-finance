import { Radio } from "antd";
import styled from "styled-components";
export const StyledTabRadioSolidButtons = styled(Radio.Group)`
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
    row-gap: 8px;
    flex-wrap: wrap;
& .ant-radio-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.color700};
        font-size: 16px;
        line-height: 1;
        font-weight: 500;
        margin: 0;
        border-radius: 8px;
        border:1px solid ${({ theme }) => theme.color300};
        box-shadow: 0px 1px 2px 0px #1018280D;
        padding: 13px 18px;
        position: relative;
        & > span{
            padding: 0;
        }
        & .ant-radio{
            display: none;
        }
        &.ant-radio-wrapper-checked{
            color: ${({ theme }) => theme.systemDefaults.colorPrimary};
            background-color: ${({ theme }) => theme.colorFillCustom};
            border-color: transparent;
            padding-left: 42px;
            &::before{
                content: url("data:image/svg+xml,%3Csvg stroke='%230e8737' fill='none' stroke-width='2' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' height='20px' width='20px' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 6 6 18'%3E%3C/path%3E%3Cpath d='m6 6 12 12'%3E%3C/path%3E%3C/svg%3E");
                position: absolute;
                left: 18px;
                top: 11px;
            }
        }

    }
    
`

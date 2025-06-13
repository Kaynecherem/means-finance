import { Radio } from "antd";
import styled from "styled-components";

export const BillTypeRadioGroup = styled(Radio.Group)`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: -8px;
    & .ant-radio-button-wrapper{
        border: 1px solid ${({ theme }) => theme.color200};
        border-radius: 8px;
        height: auto;
        padding: 16px 0px;
        margin: 8px;
        width: 200px;
        &::before{
            display: none;
        }
        & > span:not(.ant-radio-button){
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        & .icon-wrapper{
            height: 56px;
            width: 56px;
            font-size: 28px;
            color: ${({ theme }) => theme.color900};
            background-color: ${({ theme }) => theme.color100};
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        & .text-wrapper{
            font-size: 18px;
            font-weight: 600;
            color: ${({ theme }) => theme.color700};
            margin: 20px;
            line-height: 1;
        }

        & .radio-selection{
            height: 20px;
            width: 20px;
            border: 1px solid ${({ theme }) => theme.color200};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &.ant-radio-button-wrapper-checked{
            border-color:${({ theme }) => theme.systemDefaults.colorPrimary} ;
            background-color:${({ theme }) => theme.systemDefaults.colorPrimary} ;
            & .icon-wrapper{
                background-color:${({ theme }) => theme.systemDefaults.colorPrimaryBg} ;
                color: white;
                border: 8px solid white;
            }

            & .text-wrapper{
                color: white;
            }

            & .radio-selection{
                background-color: white;
                &::after{
                    content: "";
                    height: 8px;
                    width: 8px;
                    display: block;
                    background:${({ theme }) => theme.systemDefaults.colorPrimary};
                    border-radius: 50%;
                }
            }
        }
    }
`


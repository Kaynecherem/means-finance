import { Table } from "antd";
import styled from "styled-components";
import SubmitButton from "../../../components/Form/SubmitButton";
export const CustomerBillsLoadingWrapper = styled.div`
    padding: 40px;
    min-height: 300px;
    align-items: center;
    display: flex;
    justify-content: center;
`
export const CustomerBillsWrapper = styled.div`
    padding: 32px 40px;
    `

export const BillDueWrapper = styled.div`
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.color200};
    & .text {
        font-size: 14px;
        line-height: 20px;
        color: ${({ theme }) => theme.color500};
    }

    & .time{
        font-size: 18px;
        line-height: 28px;
        color: ${({ theme }) => theme.colorError500};
    }
`
export const PolicyInfo = styled.div`
    row-gap: 12px;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    padding-bottom: 40px;
    border-bottom: 1px solid ${({ theme }) => theme.color200};
    & .info-row{
        color: ${({ theme }) => theme.color700};
        display: flex;
        align-items: center;
        justify-content: space-between;
        & .info-title{
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
        }
        & .info-value{
            font-size: 16px;
            font-weight: 600;
            line-height: 24px;
            display: flex;
            align-items: center;    
            column-gap: 10px;
        }
    }
`
export const PayButton = styled(SubmitButton)`
    width: 100%;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    margin-top: 16px;
`
export const PaymentHistoryTable = styled(Table)`
    background: none;
    & .ant-table-thead .ant-table-cell{
        color: ${({ theme }) => theme.color500};
    }
    & .ant-table-cell{
        background: transparent;
        border:none;
        padding: 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: ${({ theme }) => theme.color800};

        &::before{
            display: none;
        }
    }   
`
export const StatusWrapper = styled.div<{ danger?: boolean }>`
        color: ${({ theme, danger }) => danger ? theme.colorError500 : theme.systemDefaults.colorPrimary};
`

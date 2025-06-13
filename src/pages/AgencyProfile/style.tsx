import styled from "styled-components";

export const AgencyProfilePageWrapper = styled.div`
    padding: 40px;
    padding-top: 60px;
`
export const AgencyName = styled.div`
    font-size: 30px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
    color: ${({ theme }) => theme.color900};
    & .ant-btn-link{
        padding: 0%;
        height: 36px;
        width: 36px;
        font-size: 20px;
        margin-left:24px ;
    }
`
export const BillDueWrapper = styled.div`
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 17px;
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
export const InfoHeading = styled.div`
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-align: left;
    color: ${({ theme }) => theme.color700};
    margin-bottom: 8px;
`
export const LabelIcon = styled.div`
        color: ${({ theme }) => theme.systemDefaults.colorPrimary};
        background-color: ${({ theme }) => theme.systemDefaults.colorPrimaryBg};
        height: 24px;
        width: 24px;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
`
export const InfoValue = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color700};
    display: flex;
    align-items: center;
    column-gap: 10px;
`
export const Separator = styled.div`
    width: 100%;
    max-width: 360px;
    height: 1px;
    background-color: ${({ theme }) => theme.color200};
    display: inline-block;
`
export const BankHeading = styled.div`  
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    text-align: center;
    color: ${({ theme }) => theme.color900};
    display: flex;
    align-items: center;
    column-gap: 10px;
`
export const BankValue = styled.div`
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    text-align: right;
    color: ${({ theme }) => theme.color700};

`

import styled from "styled-components";

export const DownPaymentWrapper = styled.div`
    & .title{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        color: ${({ theme }) => theme.systemDefaults.colorPrimary};
    }
`
export const AmountWrapper = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${({ theme }) => theme.color900};
        font-weight: 600;
        line-height:60px;
        & .currency{
            font-size: 36px;
        }
        & .amount{
            font-size: 48px;
        }
`
export const SummaryWrapper = styled.div`
    width: 100%;
    max-width: 569px;
    border: 1px solid ${({ theme }) => theme.color200};
    border-radius: 8px;
    margin: 0 auto;
    margin-top: 8px;
    box-shadow: 0px 1px 3px 0px #1018281A;

`

export const BilledDetails = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.color900};
    padding: 24px;
    border-bottom: 1px solid ${({ theme }) => theme.color200};
    & .text{
        font-size: 18px;
        font-weight: 500;
        line-height: 24px;
    }
    @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
        flex-direction: column;
    justify-content: center;
    text-align: center;
    }
`

export const SummaryDetails = styled.div`
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & .text{
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: ${({ theme }) => theme.color500};
    }
    & .amount{
        font-size: 18px;
        font-weight: 500;
        line-height: 28px;
        color: ${({ theme }) => theme.systemDefaults.colorPrimary};
    }
`

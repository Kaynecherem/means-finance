import styled from "styled-components";

export const NextBillCardWrapper = styled.div`
    padding: 16px;
`
export const NextBillHeading = styled.div`
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.color900};
`
export const NextBillAmountWrapper = styled.div<{ isDue?: boolean }>`
    color: ${({ theme }) => theme.colorSuccess500};
    font-weight: 600;
    display: flex;
    align-items: flex-start;
    column-gap: 2px;
    margin-top: ${({ isDue }) => isDue ? "0" : "16px"};
    & .currency{
        font-size: 24px;
        line-height: ${({ isDue }) => isDue ? "35px" : "44px"};
        letter-spacing: -0.02em;
        padding-top: 6px;
    }
    & .amount{
        font-size: 32px;
        line-height: ${({ isDue }) => isDue ? "50px" : "60px"};
        letter-spacing: -0.02em;
    }
`
export const NextBillDueDate = styled.div<{ isDue?: boolean }>`
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.color600};
    margin-top: ${({ isDue }) => isDue ? "0" : "5px"};
`
export const GetPaidWrapper = styled.div`
    padding: 32.5px 16px 16px 16px;
`
export const GetPaidHeader = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color900};
`
export const GetPaidCardFooter = styled.div`
    position: absolute;
    width: calc(100% - 32px);
    bottom: 16px;
`
export const BillsCardWrapper = styled.div`
    padding: 16px 24px;
`
export const BillAgencyDetails = styled.div`
    display: flex;
    column-gap: 10px;
    & .details{
        & .name{
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            letter-spacing: 0.20000000298023224px;
        }
        & .address{
            font-size: 12px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: 0.20000000298023224px;
            color: ${({ theme }) => theme.grayWarm500};
        }
    }

`

export const BillTypeWrapper = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.20000000298023224px;
`
export const BillDueDateWrapper = styled.div`
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0.20000000298023224px;
    color: ${({ theme }) => theme.grayWarm500};
`

export const BillAmountWrapper = styled.div`
        & .amount{
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            letter-spacing: 0.20000000298023224px;
        }
        & .due-count{
            font-size: 12px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: 0.20000000298023224px;
            color: ${({ theme }) => theme.grayWarm500};
        }
`

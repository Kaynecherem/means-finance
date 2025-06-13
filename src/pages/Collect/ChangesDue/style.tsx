import styled from "styled-components";

export const DueWrapper = styled.div`
    padding: 40px;
    `
export const AmountWrapper = styled.div`
            margin-top:1px;
            color: ${({ theme }) => theme.colorSuccess500};
            display: flex;
            align-items: center;
            justify-content: center;
            & .currency{
                font-size: 36px;
                font-weight: 600;
                line-height: 44px;
                letter-spacing: -0.02em;
                margin-right: 2px;
            }
            & .number{
                font-size: 48px;
                font-weight: 600;
                line-height: 60px;
                letter-spacing: -0.02em;
            }
`

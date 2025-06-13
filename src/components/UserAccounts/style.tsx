import styled from "styled-components";

export const AccountInfo = styled.div`
    & .label{
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: ${({ theme }) => theme.color700};
    }
    & .value{
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: ${({ theme }) => theme.colorSuccess500};
    }
`

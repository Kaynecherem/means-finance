import styled from "styled-components";

export const QuotePageWrapper = styled.div`
    padding: 32px 40px;
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}px) {
        padding: 10px;
    } 

`

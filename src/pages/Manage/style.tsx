import styled from "styled-components";

export const TabLabelWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
export const HelpText = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color:  ${({ theme }) => theme.color500};
    margin-top: 16px;
`
export const ManageTableWrapper = styled.div`
    padding: 16px 24px;
`

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 12px;
`


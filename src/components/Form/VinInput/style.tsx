import { Button, Card } from "antd";
import styled from "styled-components";

export const StyledVinCard = styled(Card)`
    & .ant-card-head{
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: ${({ theme }) => theme.color700};
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

export const InfoValue = styled.div`
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: ${({ theme }) => theme.color700};
`
export const DeleteButton = styled(Button)`
    color: ${({ theme }) => theme.systemDefaults.colorError};
`
export const ErrorText = styled.div`
    color: ${({ theme }) => theme.systemDefaults.colorError};
`

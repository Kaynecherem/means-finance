import { Button } from "antd";
import styled from "styled-components";

export const AcceptText = styled.div`
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: ${({ theme }) => theme.color500};
`
export const PhoneNumberText = styled.div`
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    color: ${({ theme }) => theme.systemDefaults.colorPrimary};
`
export const ResendCodeButton = styled(Button)`
    height: auto;
    padding: 10px 18px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color700};
    border: 1px solid ${({ theme }) => theme.color300};
`
export const CancelButton = styled(Button)`
    height: auto;
    padding: 10px 18px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.systemDefaults.colorWhite};
    background-color: ${({ theme }) => theme.systemDefaults.colorError};
    border-color: 1px solid ${({ theme }) => theme.systemDefaults.colorError};
    box-shadow: none;
`

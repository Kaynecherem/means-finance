import styled from "styled-components";

export const LoginPageWrapper = styled.div`
    min-height: 550px;
    align-content: center;
    padding: 20px;
`
export const ForgotPasswordLinkWrapper = styled.div`
    text-align: right;
    margin-top: 6px;
    & a{
        color: ${({ theme }) => theme.systemDefaults.colorPrimary};

    }
`

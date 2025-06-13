import { Button } from "antd";
import styled from "styled-components";

export const ProfileCardWrapper = styled.div`
    padding:40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 24px;
`
export const ProfileAvatar = styled.div`
    & > div{
        width: 150px;
        height: 150px;
        font-size: 80px;
    }
`
export const ProfileName = styled.div`
    font-size: 30px;
    font-weight: 700;
    line-height: 18px;
    color: ${({ theme }) => theme.color900};
`

export const ProfileNumber = styled.div`
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: ${({ theme }) => theme.color500};
    display: flex;
    align-items: center;
    & svg{
        margin-right: 5px;
    }
`
export const EditProfileButton = styled(Button)`
    padding: 10px 18px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    height:auto;
    color: ${({ theme }) => theme.color700};
    border-color: ${({ theme }) => theme.color300};
`

import { Button, Dropdown, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledHeader = styled(Layout.Header)`
    background-color: ${({ theme }) => theme.systemDefaults.colorBgContainer};
    display: flex;
    align-items: center;
    height: 80px;
    justify-content: space-between;
`;
export const MainMenu = styled(Menu)`
    min-width: 0;
    border: none;
    flex: 1;
    justify-content: center;
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}px) {
      display: none;
    }   
    & > .ant-menu-item{
        color: ${({ theme }) => theme.navigationMenuTextColor};
        font-size: 16px;
        font-weight: 500;
    }
    & > .ant-menu-item.ant-menu-item-active, & > .ant-menu-item:hover, & > .ant-menu-item.ant-menu-item-selected{
        color: ${({ theme }) => theme.systemDefaults.colorPrimary};
        &::after{
            display: none;
        }
    }

`
export const LeftNavigation = styled.div`
    display: flex;
    align-items:center;
    column-gap: 24px;
`

export const AppLogo = styled.img`
    height: 32px;
`

export const ProfileButton = styled(Link)`
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.color800};
    display: flex;
    align-items: center;
    column-gap: 12px;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}px) {
      display: none;
    } 
    & > .ant-avatar{
        align-items: center;
        justify-content: center;
        display: flex;
        color: ${({ theme }) => theme.systemDefaults.colorPrimary};
        background-color: ${({ theme }) => theme.systemDefaults.colorPrimaryBg};
        font-size: 20px;
    }
`

export const AuthButton = styled(Button)`
    color: ${({ theme }) => theme.navigationMenuTextColor};
    font-size: 16px;
    font-weight: 500;
    padding:10px 18px;
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}px) {
      display: none;
    } 
`
export const MenuButton = styled(Dropdown)`
    color: ${({ theme }) => theme.navigationMenuTextColor};
    font-size: 24px;
    font-weight: 500;
    @media (min-width: ${({ theme }) => theme.breakpoints.lg + 1}px) {
      display: none;
    } 
`

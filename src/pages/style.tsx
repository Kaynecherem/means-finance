import { Button, Typography } from 'antd';
import styled, { DefaultTheme } from 'styled-components';
export const PageBackButton = styled(Button)`
    height: 36px;
    width: 36px;
    padding: 0;
    display: flex;
    margin-top: 14px;
    margin-bottom: 24px;
`

export const PageHeader = styled(Typography.Title)`
    font-size: 30px;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.color900};
`

export const PageSubHeader = styled(Typography.Title)`
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin-top: 8px;
    margin-bottom: 2px;
    color: ${({ theme }) => theme.color900};
`
export const getStatusColor = (theme: DefaultTheme, status?: string | null) => {
    switch (status) {
        case "missed":
            return theme.colorError500
        case "pending":
        case "upcoming":
            return theme.systemDefaults.colorWarning
        default:
            return theme.systemDefaults.colorPrimary
    }
}
export const StatusWrapper = styled.div<{ status?: string | null }>`
        color: ${({ theme, status }) => getStatusColor(theme, status)};
        text-transform: capitalize;
`

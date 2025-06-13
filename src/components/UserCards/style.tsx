import { Button, Carousel } from 'antd';
import styled from "styled-components";

export const UserCardWrapper = styled.div`
    padding: 24px 16px;
`
export const UserCardHeading = styled.div`
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.color900};
`
export const AddButton = styled(Button)`
    background-color: ${({ theme }) => theme.colorSuccess50};
    border-color: ${({ theme }) => theme.colorSuccess50};
    color: ${({ theme }) => theme.systemDefaults.colorPrimary};
    font-size: 20px;
    height: 44px;
    width: 44px;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
`

export const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${({ theme }) => theme.color200};
    width: 100%;
    padding: 16px;
    border-radius: 8px;
`
export const CardInfoWrapper = styled.div`
    display: flex;
    align-items: center;
    column-gap: 16px;
`
export const CardIconWrapper = styled.div`
    width: 50px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.color100};
    display: flex;
    align-items: center;
    justify-content: center;
    & img{
        width: 36px;
    }
`
export const CardDetailsWrapper = styled.div`
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
    & .details{
        color: ${({ theme }) => theme.color700};
    }
    & .expiry{
        color: ${({ theme }) => theme.color500};
    }
`
export const CardChangeButtonWrapper = styled.div`
    width: 93px;
`
export const StyledCarousel = styled(Carousel)`
    & .slick-arrow{
        color: ${({ theme }) => theme.color900};
        &.slick-prev{
            inset-inline-start:-14px;
        }
        &.slick-next{
            inset-inline-end:-14px;
        }
    }
    & .slick-dots {
        &.slick-dots-bottom{
            bottom: -10px;
        }
        & li button{
            background-color: ${({ theme }) => theme.color700};
        }
    }
`
export const NoCardIcon = styled.div`
    text-align: center;
    width: 100%;
    font-size: 16px;
    color: ${({ theme }) => theme.color500};

`
export const NoCardText = styled.div`
    text-align: center;
    width: 100%;
    font-size: 14px;
    color: ${({ theme }) => theme.grayWarm500};
`
export const DropdownContent = styled.div`
    min-width: 200px;
`
export const DeleteButton = styled(Button)`
    height: auto;
    width: 100%;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.systemDefaults.colorWhite};
    background-color: ${({ theme }) => theme.systemDefaults.colorError};
    border-color: 1px solid ${({ theme }) => theme.systemDefaults.colorError};
    box-shadow: none;
`

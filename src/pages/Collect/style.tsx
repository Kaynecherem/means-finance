import styled from 'styled-components';
export const CustomerName = styled.div`
    font-size: 30px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
    color: ${({ theme }) => theme.color900};
    & .ant-btn-link{
        padding: 0%;
        height: 36px;
        width: 36px;
        font-size: 20px;
        margin-left:24px ;
    }
`

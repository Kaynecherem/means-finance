import React from 'react';
import DoubleCoinIconDanger from "../../assets/images/Icons/DoubleCoinDanger.svg";
import DoubleCoinIconPrimary from "../../assets/images/Icons/DoubleCoinPrimary.svg";
import { StyledDueNow } from './style';

export type DueNowType = 'primary' | 'danger';
export type DueNowProps = {
    type?: DueNowType;
};

const DueNow: React.FC<DueNowProps & { amount: number; label?: string }> = ({ amount, label, ...props }) => {
    return (
        <StyledDueNow {...props}>
            <div className='icon-wrapper' data-testid="icon-wrapper">
                <div className='icon' data-testid="icon">
                    <img src={props.type === 'danger' ? DoubleCoinIconDanger : DoubleCoinIconPrimary} alt='double coin icon' />
                </div>
            </div>
            <div className='content-wrapper' data-testid="content-wrapper">
                <div className='title' data-testid="title">
                    {label ?? 'Due Now'}
                </div>
                <div className='amount-wrapper' data-testid="amount-wrapper">
                    <div className='currency'>$</div>
                    <div className='number' data-testid="amount">
                        {Number(amount).toFixed(2)}
                    </div>
                </div>
            </div>
        </StyledDueNow>
    );
};

export default DueNow;

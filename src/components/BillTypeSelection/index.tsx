import { Radio, RadioGroupProps } from 'antd';
import React, { ReactNode } from 'react';
import { BillTypeRadioGroup } from './style';
const BillTypeSelection: React.FC<RadioGroupProps & {
    billTypes: Array<{
        key: string,
        label: string,
        icon: ReactNode
    }>
}> = ({ billTypes, ...props }) => {
    return <BillTypeRadioGroup {...props} >
        {
            billTypes.map(type => (
                <Radio.Button value={type.key} key={type.key}>
                    <div className='icon-wrapper'>
                        {type.icon}
                    </div>
                    <div className='text-wrapper'>
                        {type.label}
                    </div>
                    <div className='radio-selection' />
                </Radio.Button>
            ))
        }
    </BillTypeRadioGroup>
}

export default BillTypeSelection

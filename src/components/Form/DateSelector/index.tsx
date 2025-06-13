import { CheckboxGroupProps } from 'antd/es/checkbox';
import React, { useCallback, useEffect, useState } from 'react';
import { StyledDateSelector } from './style';
const defaultSelectionLimit = 1
const defaultDays = 31
const DateSelector: React.FC<CheckboxGroupProps<number> & {
    selectionLimit?: number,
    days?: number
}> = ({ selectionLimit = defaultSelectionLimit, days = defaultDays, onChange, value, defaultValue, ...props }) => {
    const [options, setOptions] = useState(Array(days).fill('').map((_, index) => ({
        label: index + 1,
        value: index + 1
    })))

    useEffect(() => {
        setOptions(Array(days).fill('').map((_, index) => ({
            label: index + 1,
            value: index + 1
        })))
    }, [days])
    const [selectedValue, setSelectedValue] = useState<Array<number>>([])
    useEffect(() => {
        if (defaultValue) {
            setSelectedValue(defaultValue.slice(0, selectionLimit))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (value) {
            setSelectedValue(value.slice(0, selectionLimit))
        }
    }, [selectionLimit, value])

    const handleOnChange = useCallback((checkedValues: Array<number>) => {
        let updatingValue = [...selectedValue]
        if (checkedValues.length > selectionLimit) {
            const checkedValue = checkedValues.find(element => !selectedValue.includes(element))
            if (checkedValue) {
                if (selectionLimit === 1) {
                    updatingValue = [checkedValue]
                } else {
                    updatingValue = [...selectedValue.slice(-(selectionLimit - 1)), checkedValue]
                }
            }
        } else {
            updatingValue = [...checkedValues]
        }
        setSelectedValue(updatingValue)
        if (onChange) {
            onChange(updatingValue)
        }
    }, [onChange, selectedValue, selectionLimit])
    return <StyledDateSelector {...props} options={options} value={selectedValue} onChange={handleOnChange} />
}

export default DateSelector

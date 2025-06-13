import phone, { countryPhoneData } from "phone";
import React, { useEffect, useState } from 'react';
import { LuChevronDown } from "react-icons/lu";
import { StyledCountrySelect, StyledPhoneField, StyledPhoneFieldWrapper } from './style';

export type CountryData = {
    alpha2: string;
    alpha3: string;
    country_code: string;
    country_name: string;
    mobile_begin_with: string[];
    phone_number_lengths: number[];
}

export type IntervalType = {
    country?: CountryData,
    number?: string
}

const PhoneField: React.FC<{
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
}> = ({ value, onChange, disabled }) => {
    const [internalValue, setInternalValue] = useState<IntervalType>({})

    useEffect(() => {
        if (value) {
            const numberDetails = phone(value)
            if (numberDetails.isValid) {
                const number = numberDetails.phoneNumber?.replace(numberDetails.countryCode, '')
                const country = countryPhoneData.find(countryData => countryData.alpha2 === numberDetails.countryIso2)
                if (number !== internalValue.number || country?.alpha2 !== internalValue.country?.alpha2) {
                    setInternalValue({ number, country })
                }
            } else if (value !== internalValue.number) {
                setInternalValue({ number: value })
            }
        } else if (value === "") {
            const country = countryPhoneData.find(countryData => countryData.alpha2 === 'US')
            setInternalValue({ number: value, country })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleChange = (data: IntervalType) => {
        if (onChange) {
            if (data.number) {
                const phoneDetails = phone(data.number, { country: data.country?.alpha2 ?? 'US' })
                if (phoneDetails.isValid && phoneDetails.phoneNumber !== value) {
                    onChange(phoneDetails.phoneNumber)
                } else {
                    onChange(data.number)
                }
            } else if (!data.country) {
                onChange("")
            }
        }
    }

    return (
        <StyledPhoneFieldWrapper data-testid="phone-field-wrapper">
            <StyledCountrySelect
                data-testid="country-select"
                suffixIcon={<LuChevronDown />}
                showSearch
                defaultValue={'US'}
                popupMatchSelectWidth={false}
                labelRender={label => label.value}
                value={internalValue.country?.alpha2}
                options={countryPhoneData}
                fieldNames={{
                    value: 'alpha2',
                }}
                optionRender={option => <>+{option.data.country_code} - {option.data.country_name}</>}
                filterOption={(inputValue, option) => {
                    const trimmedInputValue = inputValue.toLowerCase().replace('+', '')
                    return option?.alpha2.toLowerCase().includes(trimmedInputValue) ||
                        option?.country_code.toLowerCase().includes(trimmedInputValue) ||
                        option?.country_name.toLowerCase().includes(trimmedInputValue)
                }}

                onChange={(_, option) => {
                    const data = { country: { ...option } as CountryData, number: '' }
                    setInternalValue(data)
                    handleChange(data)
                }}
                disabled={disabled}
            />
            <StyledPhoneField
                data-testid="phone-input"
                value={internalValue.number}
                onChange={event => {
                    const data = { ...internalValue, number: event.target.value }
                    setInternalValue(data)
                    handleChange(data)
                }}
                disabled={disabled}
            />
        </StyledPhoneFieldWrapper>
    )
}

export default PhoneField

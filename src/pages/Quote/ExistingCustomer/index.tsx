import { AutoComplete, Col, message, Row, Spin } from "antd";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LuArrowRight, LuSearch } from 'react-icons/lu';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDirectUs } from '../../../components/DirectUs/DirectusContext';
import TextField from "../../../components/Form/TextField";
import SubmitButton from "../../../components/Form/SubmitButton";
import { resetQuote, updateQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from '../../../utils/redux/store';
import { InternalErrors } from "../../../utils/types/errors";
import { CustomDirectusUser } from "../../../utils/types/schema";
import { searchCustomerByName } from "../../../utils/apis/directus";
import { PageHeader, PageSubHeader } from "../../style";
import { ExistingCustomerWrapper, LoadingDropDownRender, NameSelectionOption, SearchByNameWrapper } from "./style";

type OptionType = {
    value: string;
    label: ReactNode;
    customer: CustomDirectusUser;
};

const ExistingCustomer: React.FC = () => {
    const { directusClient } = useDirectUs();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quote = useSelector(({ quote: stateQuote }: RootState) => stateQuote);
    const [options, setOptions] = useState<CustomDirectusUser[]>([]);
    const [fetching, setFetching] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (quote.existingCustomerId) {
            const fullName = `${quote.customerFirstName ?? ''} ${quote.customerLastName ?? ''}`.trim();
            if (fullName) {
                setInputValue(fullName);
            }
        }
    }, [quote.customerFirstName, quote.customerLastName, quote.existingCustomerId]);

    const handleSearch = useCallback(async (query: string) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery.length < 3) {
            setOptions([]);
            return;
        }
        try {
            setFetching(true);
            const users = await searchCustomerByName(directusClient, trimmedQuery);
            setOptions(users);
        } catch (error) {
            message.error((error as InternalErrors).message);
        } finally {
            setFetching(false);
        }
    }, [directusClient]);

    const handleSelect = useCallback((_value: string, option: OptionType) => {
        const customer = option.customer;
        if (!customer.email) {
            message.error('Selected customer is missing an email address.');
            return;
        }
        setInputValue(`${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim());
        dispatch(updateQuote({
            customerSelection: 'existing',
            existingCustomerId: customer.id,
            existingCustomerDeluxeCustomerId: customer.deluxe_customer_id ?? null,
            existingCustomerDeluxeVaultId: customer.deluxe_vault_id ?? null,
            customerEmail: customer.email,
            customerFirstName: customer.first_name ?? null,
            customerLastName: customer.last_name ?? null,
            customerPhone: customer.phone ?? null,
        }));

        if (customer.deluxe_customer_id || customer.deluxe_vault_id) {
            sessionStorage.setItem('deluxeData', JSON.stringify({
                data: {
                    customerId: customer.deluxe_customer_id,
                    vaultId: customer.deluxe_vault_id,
                }
            }));
        } else {
            sessionStorage.removeItem('deluxeData');
        }
    }, [dispatch]);

    const handleStartOver = useCallback(() => {
        sessionStorage.removeItem('deluxeData');
        dispatch(resetQuote());
        navigate('/agency/quote/bill-type');
    }, [dispatch, navigate]);

    const handleContinue = useCallback(() => {
        if (!quote.existingCustomerId) {
            message.error('Please select a customer before continuing.');
            return;
        }
        navigate('/agency/quote/customer-info');
    }, [navigate, quote.existingCustomerId]);

    const autocompleteOptions = useMemo(() => options.map<OptionType>((customer) => ({
        value: String(customer.id),
        customer,
        label: (
            <NameSelectionOption>
                <div className='name'>{customer.first_name} {customer.last_name}</div>
                {customer.email && <div className='email'>{customer.email}</div>}
                {customer.phone && <div className='phone'>{customer.phone}</div>}
            </NameSelectionOption>
        )
    })), [options]);

    return (
        <ExistingCustomerWrapper>
            <Row gutter={[0, 24]} justify={'center'}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <PageHeader level={2}>Who is this bill for?</PageHeader>
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <PageSubHeader level={3}>Search for an existing customer.</PageSubHeader>
                </Col>
                <Col xs={24} lg={8}>
                    <SearchByNameWrapper>
                        <LuSearch />
                        <AutoComplete
                            allowClear
                            options={autocompleteOptions}
                            onSearch={handleSearch}
                            onSelect={handleSelect}
                            value={inputValue}
                            onChange={(value) => {
                                setInputValue(value);
                                const selectedName = `${quote.customerFirstName ?? ''} ${quote.customerLastName ?? ''}`.trim();
                                const shouldClearSelection = !value || (quote.existingCustomerId && value !== selectedName);

                                if (shouldClearSelection) {
                                    dispatch(updateQuote({
                                        existingCustomerId: null,
                                        existingCustomerDeluxeCustomerId: null,
                                        existingCustomerDeluxeVaultId: null,
                                        customerEmail: null,
                                        customerFirstName: null,
                                        customerLastName: null,
                                        customerPhone: null,
                                    }));
                                    sessionStorage.removeItem('deluxeData');
                                }
                            }}
                            notFoundContent={fetching ? (
                                <LoadingDropDownRender>
                                    <Spin size='small' />
                                </LoadingDropDownRender>
                            ) : null}
                        >
                            <TextField placeholder="Type a customer's name" />
                        </AutoComplete>
                    </SearchByNameWrapper>
                </Col>
                <Col span={24} style={{ marginTop: '40px' }}>
                    <Row gutter={[40, 0]} justify={'center'}>
                        <Col>
                            <SubmitButton danger onClick={handleStartOver}>Start Over</SubmitButton>
                        </Col>
                        <Col>
                            <SubmitButton icon={<LuArrowRight />} onClick={handleContinue} disabled={!quote.existingCustomerId}>
                                Continue
                            </SubmitButton>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ExistingCustomerWrapper>
    );
};

export default ExistingCustomer;

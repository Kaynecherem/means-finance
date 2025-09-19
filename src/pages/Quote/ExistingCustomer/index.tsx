import { AutoComplete, Col, message, Row, Spin } from "antd";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { LuSearch } from 'react-icons/lu';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDirectUs } from '../../../components/DirectUs/DirectusContext';
import TextField from "../../../components/Form/TextField";
import { updateQuote } from "../../../utils/redux/slices/quoteSlice";
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
    const [options, setOptions] = useState<CustomDirectusUser[]>([]);
    const [fetching, setFetching] = useState(false);

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

        navigate('/agency/quote/bill-summary');
    }, [dispatch, navigate]);

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
            </Row>
        </ExistingCustomerWrapper>
    );
};

export default ExistingCustomer;

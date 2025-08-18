import { Col, Row } from "antd";
import { useState } from 'react';
import { LuPlus } from "react-icons/lu";
import { PaymentType } from '../../utils/enums/common';
import { BankAccount, PaymentRecordingWith } from "../../utils/types/common";
import CustomButton1 from "../Form/CustomButton1";
import { LoadingSpinner } from "../LoadingSpinner";
import MiniCard from "../MiniCard";
import { AddButton, CardChangeButtonWrapper, CardWrapper, StyledCarousel, UserCardHeading, UserCardWrapper } from '../UserCards/style';
import DeluxePaymentModal from "../DeluxePaymentModal";
import NoAccounts from "./NoCard";
import { AccountInfo } from "./style";

const UserAccounts: React.FC<{
    loading?: boolean
    bankAccounts?: BankAccount[]
    agencyId: number | null
    refetch?: () => void
    selectMode?: boolean,
    onSelect?: (cardId: string) => void
    paymentRecordingWith?: PaymentRecordingWith
    selectedAccountId?: string
}> = ({ loading, bankAccounts, agencyId, refetch, selectMode, onSelect, paymentRecordingWith, selectedAccountId }) => {
    const [showAddAccount, setShowAddAccount] = useState(false)

    const AccountComponent = (props: { account: BankAccount }) => <CardWrapper style={{ justifyContent: "space-evenly" }}>
        <AccountInfo>
            <div className="label">
                Routing #
            </div>
            <div className="value">
                {props.account.routing_number}
            </div>
        </AccountInfo>
        <AccountInfo>
            <div className="label">
                Account #
            </div>
            <div className="value">
                {props.account.account_number.replaceAll("*", ".")}
            </div>
        </AccountInfo>
        {selectMode &&
            <CardChangeButtonWrapper>
                <CustomButton1
                    onClick={() => {
                        if (onSelect) {
                            onSelect(props.account.id)
                        }
                    }}
                    loading={paymentRecordingWith?.type === PaymentType.DIRECT_DEBIT && paymentRecordingWith.id === props.account.id}
                >{selectedAccountId === props.account.id ? 'Selected' : 'Select'}</CustomButton1>
            </CardChangeButtonWrapper>
        }
    </CardWrapper>

    const handleOnAccountAdd = async () => {
        if (refetch) {
            refetch()
            setShowAddAccount(false)
        }
    }

    return <MiniCard>
        <UserCardWrapper>
            {loading &&
                <LoadingSpinner style={{ minHeight: "unset", width: "100%", height: "100%" }} fullScreen />
            }
            {!loading &&
                <>
                    <Row align={"middle"} justify={"space-between"}>
                        <Col>
                            {!selectMode &&
                                <UserCardHeading>
                                    Linked Bank Account
                                </UserCardHeading>
                            }
                            {selectMode &&
                                <UserCardHeading>
                                    Choose Account
                                </UserCardHeading>
                            }
                        </Col>
                        {!selectMode &&
                            <Col>
                                <AddButton icon={<LuPlus />} onClick={() => setShowAddAccount(true)} />
                            </Col>
                        }
                    </Row>
                    <Row style={{ marginTop: "20px" }}>
                        <Col span={24}>
                            {
                                (!bankAccounts || bankAccounts?.length === 0) &&
                                <NoAccounts />
                            }
                            <StyledCarousel dots draggable infinite={false}>
                                {
                                    bankAccounts?.map(account => (

                                        <div key={`account-wrapper-${account.id}`}>
                                            <AccountComponent account={account} />
                                        </div>
                                    ))
                                }
                            </StyledCarousel>
                        </Col>
                    </Row>
                </>
            }
            <DeluxePaymentModal open={showAddAccount} onClose={() => setShowAddAccount(false)} onPaymentAdd={handleOnAccountAdd} />

        </UserCardWrapper>
    </MiniCard>
}

export default UserAccounts

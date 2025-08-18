import { Col, Dropdown, Row, message } from 'antd';
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { deleteUserCard } from "../../utils/apis/directus";
import { CARD_TYPE_BRAND_MAPPING } from '../../utils/contants/common';
import { PaymentType } from '../../utils/enums/common';
import { Card, PaymentRecordingWith } from "../../utils/types/common";
import { InternalErrors } from '../../utils/types/errors';
import Box from "../Box";
import { useDirectUs } from "../DirectUs/DirectusContext";
import CardIcon from "../Form/CardNumberInput/CardIcon";
import CustomButton1 from "../Form/CustomButton1";
import { LoadingSpinner } from "../LoadingSpinner";
import MiniCard from "../MiniCard";
import DeluxePaymentModal from "../DeluxePaymentModal";
import NoCard from "./NoCard";
import { AddButton, CardChangeButtonWrapper, CardDetailsWrapper, CardIconWrapper, CardInfoWrapper, CardWrapper, DeleteButton, DropdownContent, StyledCarousel, UserCardHeading, UserCardWrapper } from './style';

const UserCards: React.FC<{
    loading?: boolean
    cards?: Card[]
    agencyId: number | null
    refetch?: () => void,
    selectMode?: boolean,
    onSelect?: (cardId: string) => void
    changeLoading?: (state: boolean) => void
    paymentRecordingWith?: PaymentRecordingWith
    selectedCardId?: string
}> = ({ loading, cards, agencyId, refetch, selectMode, onSelect, changeLoading, paymentRecordingWith, selectedCardId }) => {
    const { directusClient } = useDirectUs()
    const [showAddCard, setShowAddCard] = useState(false)

    const deleteCard = async (card: Card) => {
        if (agencyId) {
            if (changeLoading) {
                changeLoading(true)
            }
            try {
                await deleteUserCard(directusClient, {
                    agency: agencyId,
                    cardId: card.id
                })
                if (refetch) {
                    refetch()
                }
            } catch (error) {
                if (changeLoading) {
                    changeLoading(false)
                }
                message.error((error as InternalErrors).message)
            }
        }
    }
    const CardComponent = (props: { card: Card }) => <CardWrapper>
        <CardInfoWrapper>
            <CardIconWrapper>
                <CardIcon cardType={CARD_TYPE_BRAND_MAPPING[props.card.brand]} />
            </CardIconWrapper>
            <CardDetailsWrapper>
                <div className="details">Ending in {props.card.last4digit}</div>
                <div className="expiry">Expiry {props.card.exp_month}/{props.card.exp_year}</div>
            </CardDetailsWrapper>
        </CardInfoWrapper>
        <CardChangeButtonWrapper>
            {!selectMode &&
                <Dropdown
                    placement="bottomRight"
                    dropdownRender={() => {
                        return <DropdownContent>
                            <Box>
                                <div style={{ padding: "16px" }}>
                                    <Row gutter={[16, 16]}>
                                        {/* <Col span={24}>
                                    <Row justify={"space-between"}>
                                        <Col>
                                            Default
                                        </Col>
                                        <Col>
                                            <Switch size="small" />
                                        </Col>
                                    </Row>
                                </Col> */}
                                        <Col span={24}>
                                            <DeleteButton danger onClick={e => {
                                                e.stopPropagation()
                                                deleteCard(props.card)
                                            }}>Delete Card</DeleteButton>
                                        </Col>
                                    </Row>
                                </div>
                            </Box>
                        </DropdownContent>
                    }}>
                    <CustomButton1>CHANGE</CustomButton1>
                </Dropdown>
            }
            {selectMode &&
                <CustomButton1
                    onClick={() => {
                        if (onSelect) {
                            onSelect(props.card.id)
                        }
                    }}
                    loading={paymentRecordingWith?.type === PaymentType.CARD && paymentRecordingWith.id === props.card.id}
                >{selectedCardId === props.card.id ? 'Selected' : 'Select'}</CustomButton1>
            }
        </CardChangeButtonWrapper>
    </CardWrapper>
    const handleOnCardAdd = async () => {
        if (refetch) {
            refetch()
            setShowAddCard(false)
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
                                    Linked Cards
                                </UserCardHeading>
                            }
                            {selectMode &&
                                <UserCardHeading>
                                    Choose card
                                </UserCardHeading>
                            }
                        </Col>
                        {!selectMode &&
                            <Col>
                                <AddButton icon={<LuPlus />} onClick={() => setShowAddCard(true)} />
                            </Col>
                        }
                    </Row>
                    <Row style={{ marginTop: "20px" }}>

                        <Col span={24}>
                            {
                                (!cards || cards?.length === 0) &&
                                <NoCard />
                            }
                            <StyledCarousel dots draggable infinite={false}>
                                {
                                    cards?.map(card => (
                                        <div key={`card-component-${card.id}`}>
                                            <CardComponent card={card} />
                                        </div>
                                    ))
                                }
                            </StyledCarousel>
                        </Col>
                    </Row>
                </>
            }
            <DeluxePaymentModal open={showAddCard} onClose={() => setShowAddCard(false)} onPaymentAdd={handleOnCardAdd} />
        </UserCardWrapper>
    </MiniCard>
}

export default UserCards

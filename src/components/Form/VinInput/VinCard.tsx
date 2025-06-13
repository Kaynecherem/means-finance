import { Col, Row, Skeleton } from 'antd';
import { ChangeEvent } from "react";
import { LuTrash2 } from "react-icons/lu";
import { VIN } from "../../../utils/types/common";
import TextField from "../TextField";
import { DeleteButton, ErrorText, InfoHeading, InfoValue, StyledVinCard } from "./style";
import { VINLoading } from "./VinInput";

// VinCard component
interface VinCardProps {
    index: number;
    vin: VIN & VINLoading;
    onVinChange: (index: number, vin: VIN) => void;
    onRemove: (index: number) => void;
    deleteDisabled: boolean
}
const VinCard: React.FC<VinCardProps> = ({ index, vin, onVinChange, onRemove, deleteDisabled }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onVinChange(index, { vin: event.target.value.trim().toUpperCase() });
    };



    return (
        <StyledVinCard
            title={`Vehicle ${index + 1}`}
            extra={<DeleteButton onClick={() => onRemove(index)} disabled={deleteDisabled} type="link"><LuTrash2 /></DeleteButton>}
        >
            <Row gutter={[0, 12]} justify={'center'}>
                <Col span={24}>
                    <TextField type="text" value={vin.vin} onChange={handleChange} placeholder="Enter VIN number" />
                    {vin.errorCode && vin.errorCode !== '0' &&
                        <ErrorText data-testid='vin-card-error-text'>Not a valid VIN</ErrorText>
                    }
                </Col>
                <Col span={20}>
                    <Row gutter={[0, 12]}>
                        <Col span={10}>
                            <InfoHeading>Make</InfoHeading>
                        </Col>
                        <Col span={14}>
                            {vin.loading ?
                                <span data-testid="vin-card-skeleton"><Skeleton.Input size="small" active /></span>
                                :
                                <InfoValue data-testid="vin-card-values">{vin.make ?? '-'}</InfoValue>
                            }
                        </Col>
                        <Col span={10}>
                            <InfoHeading>Model</InfoHeading>
                        </Col>
                        <Col span={14}>
                            {vin.loading ?
                                <span data-testid="vin-card-skeleton"><Skeleton.Input size="small" active /></span>
                                :
                                <InfoValue data-testid="vin-card-values">{vin.model ?? '-'}</InfoValue>
                            }
                        </Col>
                        <Col span={10}>
                            <InfoHeading>Year</InfoHeading>
                        </Col>
                        <Col span={14}>
                            {vin.loading ?
                                <span data-testid="vin-card-skeleton"><Skeleton.Input size="small" active /></span>
                                :
                                <InfoValue data-testid="vin-card-values">{vin.year ?? '-'}</InfoValue>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </StyledVinCard>
    );
};

export default VinCard

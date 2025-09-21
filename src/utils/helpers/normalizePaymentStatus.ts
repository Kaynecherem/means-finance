import moment from 'moment';
import { DirectusPayment } from '../types/schema';

const normalizePaymentStatus = (
    payment: Pick<DirectusPayment, 'status' | 'due_date'>,
): string | null => {
    const rawStatus = (payment.status ?? '').trim().toLowerCase();

    if (rawStatus === 'paid' || rawStatus === 'completed') {
        return 'paid';
    }

    if (rawStatus === 'missed') {
        return 'missed';
    }

    if (rawStatus === 'pending') {
        return 'pending';
    }

    if (!rawStatus) {
        if (payment.due_date) {
            const dueDate = moment(payment.due_date);
            const today = moment();

            if (dueDate.isAfter(today, 'day')) {
                return 'upcoming';
            }
        }

        return null;
    }

    return rawStatus;
};

export default normalizePaymentStatus;

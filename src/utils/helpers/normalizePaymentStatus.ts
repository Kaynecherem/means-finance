import moment from 'moment';
import { DirectusPayment } from '../types/schema';

const normalizePaymentStatus = (
    payment: Pick<DirectusPayment, 'status' | 'due_date' | 'paid_date'>,
): string | null => {
    const status = (payment.status ?? '').trim().toLowerCase();

    if (status) {
        return status;
    }

    if (payment.paid_date) {
        return 'paid';
    }

    if (payment.due_date) {
        const dueDate = moment(payment.due_date).endOf('day');
        const now = moment();

        if (dueDate.isAfter(now)) {
            return 'upcoming';
        }

        if (dueDate.isSame(now, 'day')) {
            return 'pending';
        }

        if (dueDate.isBefore(now)) {
            return 'missed';
        }
    }

    return null;
};

export default normalizePaymentStatus;

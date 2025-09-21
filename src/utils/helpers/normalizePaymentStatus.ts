import moment from 'moment';
import { DirectusPayment } from '../types/schema';

const TRUSTED_STATUSES = new Set(['missed', 'pending', 'paid']);

const normalizePaymentStatus = (
    payment: Pick<DirectusPayment, 'status' | 'due_date'>,
): string | null => {
    const rawStatus = (payment.status ?? '').trim().toLowerCase();

    if (TRUSTED_STATUSES.has(rawStatus)) {
        return rawStatus;
    }

    if (payment.due_date) {
        const dueDate = moment(payment.due_date);
        const today = moment();

        if (dueDate.isAfter(today, 'day')) {
            return 'upcoming';
        }
    }

    return rawStatus || null;
};

export default normalizePaymentStatus;

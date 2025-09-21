import moment from 'moment';
import { DirectusPayment } from '../types/schema';

const TRUSTED_STATUSES = new Set(['missed', 'pending', 'paid', 'upcoming']);
const PENDING_SYNONYMS = new Set(['processing', 'in_progress']);

const normalizePaymentStatus = (
    payment: Pick<DirectusPayment, 'status' | 'due_date' | 'paid_date'>,
): string | null => {
    const rawStatus = (payment.status ?? '').trim().toLowerCase();

    if (TRUSTED_STATUSES.has(rawStatus)) {
        return rawStatus;
    }

    if (PENDING_SYNONYMS.has(rawStatus)) {
        return 'pending';
    }

    if (payment.paid_date) {
        return 'paid';
    }

    if (payment.due_date) {
        const dueDate = moment(payment.due_date);
        const today = moment();

        if (dueDate.isBefore(today, 'day')) {
            return 'missed';
        }

        if (dueDate.isSame(today, 'day')) {
            return 'pending';
        }

        if (dueDate.isAfter(today, 'day')) {
            return 'upcoming';
        }
    }

    return rawStatus || null;
};

export default normalizePaymentStatus;

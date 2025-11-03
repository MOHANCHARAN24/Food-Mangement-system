export const savedInstruments = [
  {
    id: 'card-visa-signature',
    label: 'Visa Signature',
    last4: '4321',
    issuer: 'HDFC Bank',
    expires: '08/28',
    perks: '5% dining cashback',
    type: 'card',
  },
  {
    id: 'card-amex-platinum',
    label: 'Amex Platinum',
    last4: '0098',
    issuer: 'American Express',
    expires: '02/27',
    perks: 'Priority seating unlock',
    type: 'card',
  },
];

export const paymentHistorySeed = [
  {
    id: 'PAY-2025-10-01',
    restaurant: {
      name: 'Masala Story Kitchen',
      slug: 'masala-story-kitchen',
    },
    amount: 3200,
    status: 'confirmed',
    method: 'Visa Signature',
    reference: 'TXN-987654',
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    note: 'Reservation deposit',
  },
  {
    id: 'PAY-2025-09-28',
    restaurant: {
      name: 'Bao & Bun District',
      slug: 'bao-and-bun-district',
    },
    amount: 1480,
    status: 'refunded',
    method: 'UPI Autopay',
    reference: 'TXN-123123',
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    note: 'Mandate reversal',
  },
  {
    id: 'PAY-2025-09-20',
    restaurant: {
      name: 'Sourdough Society Café',
      slug: 'sourdough-society-cafe',
    },
    amount: 2140,
    status: 'confirmed',
    method: 'Amex Platinum',
    reference: 'TXN-456456',
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
    note: 'Brunch reservation',
  },
];

export const paymentSummarySeed = {
  totalConfirmedAmount: 3200 + 2140,
  totalRefundedAmount: 1480,
  confirmedPayments: 2,
  refundedPayments: 1,
  lastPaymentAt: paymentHistorySeed[0].processedAt,
};

export default {
  savedInstruments,
  paymentHistorySeed,
  paymentSummarySeed,
};

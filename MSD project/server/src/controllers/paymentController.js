import Order from '../models/Order.js';
import {
  savedInstruments as savedInstrumentSeed,
  paymentHistorySeed,
  paymentSummarySeed,
} from '../data/paymentSeed.js';

const normaliseDate = (value) => (value instanceof Date ? value : new Date(value));

const buildOrderFilters = ({ email }) => {
  const filters = {};
  if (email) {
    filters['customer.email'] = email;
  }
  return filters;
};

const formatInstrument = (instrument) => ({
  id: instrument.id,
  label: instrument.label,
  last4: instrument.last4,
  issuer: instrument.issuer,
  expires: instrument.expires,
  perks: instrument.perks,
  type: instrument.type,
});

const selectors = {
  restaurant: 'name slug heroImage address.city address.area',
  order: 'restaurant payment paymentHistory totalAmount status customer createdAt updatedAt',
};

const aggregateInstrumentsFromOrders = (orders) => {
  const instruments = new Map();
  orders.forEach((order) => {
    const method = order.payment?.method;
    const reference = order.payment?.reference;
    if (!method) {
      return;
    }
    const key = `${method}-${reference || 'noref'}`;
    if (!instruments.has(key)) {
      instruments.set(key, {
        id: key,
        label: method,
        last4: reference ? reference.slice(-4) : undefined,
        issuer: order.payment?.provider,
        expires: undefined,
        perks: undefined,
        type: method.includes('card') ? 'card' : 'token',
      });
    }
  });

  if (!instruments.size) {
    savedInstrumentSeed.forEach((instrument) => {
      instruments.set(instrument.id, formatInstrument(instrument));
    });
  }

  return Array.from(instruments.values());
};

const aggregatePaymentHistory = (orders) => {
  const events = [];
  orders.forEach((order) => {
    const restaurantName = order.restaurant?.name;
    const restaurantSlug = order.restaurant?.slug;
    const baseAmount = order.payment?.amount ?? order.totalAmount;
    const baseMethod = order.payment?.method;
    const baseReference = order.payment?.reference;

    if (Array.isArray(order.paymentHistory) && order.paymentHistory.length) {
      order.paymentHistory.forEach((event, index) => {
        events.push({
          id: `${order._id}-${index}`,
          orderId: order.id || order._id,
          restaurant: {
            name: restaurantName,
            slug: restaurantSlug,
          },
          amount: event.amount ?? baseAmount,
          status: event.status,
          method: baseMethod,
          reference: event.reference || baseReference,
          note: event.note,
          processedAt: normaliseDate(event.processedAt ?? order.updatedAt ?? order.createdAt),
        });
      });
      return;
    }

    events.push({
      id: `${order._id}-0`,
      orderId: order.id || order._id,
      restaurant: {
        name: restaurantName,
        slug: restaurantSlug,
      },
      amount: baseAmount,
      status: order.payment?.status ?? order.status,
      method: baseMethod,
      reference: baseReference,
      processedAt: normaliseDate(order.updatedAt ?? order.createdAt),
    });
  });

  if (!events.length) {
    return paymentHistorySeed.map((seed, index) => ({
      id: seed.id || `seed-${index}`,
      restaurant: seed.restaurant,
      amount: seed.amount,
      status: seed.status,
      method: seed.method,
      reference: seed.reference,
      note: seed.note,
      processedAt: normaliseDate(seed.processedAt),
      isSample: true,
    }));
  }

  events.sort((a, b) => normaliseDate(b.processedAt) - normaliseDate(a.processedAt));
  return events;
};

const aggregatePaymentSummary = (history) => {
  if (!history.length) {
    return {
      ...paymentSummarySeed,
      lastPaymentAt: paymentSummarySeed.lastPaymentAt,
      isSample: true,
    };
  }

  let confirmedTotal = 0;
  let refundedTotal = 0;
  let confirmedCount = 0;
  let refundedCount = 0;
  let lastPaymentAt = null;

  history.forEach((event) => {
    const amount = event.amount || 0;
    if (event.status === 'confirmed') {
      confirmedTotal += amount;
      confirmedCount += 1;
    }
    if (event.status === 'refunded') {
      refundedTotal += amount;
      refundedCount += 1;
    }
    const processed = normaliseDate(event.processedAt);
    if (!lastPaymentAt || processed > lastPaymentAt) {
      lastPaymentAt = processed;
    }
  });

  return {
    totalConfirmedAmount: confirmedTotal,
    totalRefundedAmount: refundedTotal,
    confirmedPayments: confirmedCount,
    refundedPayments: refundedCount,
    lastPaymentAt,
  };
};

export const getPaymentMethods = async (req, res, next) => {
  try {
    const filters = buildOrderFilters({ email: req.query.email });
    const orders = await Order.find(filters)
      .select(selectors.order)
      .populate('restaurant', selectors.restaurant)
      .lean();

    const instruments = aggregateInstrumentsFromOrders(orders);

    res.json({
      items: instruments.map(formatInstrument),
      count: instruments.length,
      isSample: !orders.length,
    });
  } catch (error) {
    try {
      const fallback = savedInstrumentSeed.map(formatInstrument);
      return res.json({ items: fallback, count: fallback.length, isSample: true, error: error.message });
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const filters = buildOrderFilters({ email: req.query.email });
    const orders = await Order.find(filters)
      .select(selectors.order)
      .populate('restaurant', selectors.restaurant)
      .lean();

    const history = aggregatePaymentHistory(orders);
    const summary = aggregatePaymentSummary(history);

    res.json({
      items: history.map((event) => ({
        ...event,
        processedAt: normaliseDate(event.processedAt),
      })),
      count: history.length,
      summary,
      isSample: !orders.length,
    });
  } catch (error) {
    try {
      const history = paymentHistorySeed.map((event, index) => ({
        ...event,
        id: event.id || `seed-${index}`,
        processedAt: normaliseDate(event.processedAt),
        isSample: true,
      }));
      return res.json({
        items: history,
        count: history.length,
        summary: {
          ...paymentSummarySeed,
          isSample: true,
        },
        isSample: true,
        error: error.message,
      });
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
};

export default {
  getPaymentMethods,
  getPaymentHistory,
};

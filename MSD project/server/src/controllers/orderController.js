import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';

const ORDER_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'authorized', 'confirmed', 'failed', 'refunded'];

const getRestaurantDocument = async (restaurantId) => {
  if (!restaurantId) return null;

  if (mongoose.Types.ObjectId.isValid(restaurantId)) {
    return Restaurant.findById(restaurantId);
  }

  return Restaurant.findOne({ slug: restaurantId.toLowerCase() });
};

export const getOrders = async (req, res, next) => {
  try {
    const { email, limit = 20 } = req.query;
    const filters = {};

    if (email) {
      filters['customer.email'] = email;
    }

    const orders = await Order.find(filters)
      .populate('restaurant', 'name slug cuisine address heroImage')
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit, 10) || 20, 50));

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const appendPaymentHistory = (order, { status, amount, reference, note }) => {
  order.paymentHistory.push({
    status,
    amount,
    reference,
    note,
    processedAt: new Date(),
  });
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items = [],
      reservation,
      customer,
      payment,
      notes,
    } = req.body;

    if (!items.length) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const restaurant = await getRestaurantDocument(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for order' });
    }

    const normalisedItems = items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      notes: item.notes,
    }));

    const subtotal = normalisedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = Math.round(subtotal * 0.05 * 100) / 100;
    const fees = Math.round(subtotal * 0.02 * 100) / 100;
    const totalAmount = Math.round((subtotal + taxes + fees) * 100) / 100;

    const initialPaymentStatus = payment?.status && PAYMENT_STATUSES.includes(payment.status)
      ? payment.status
      : 'pending';

    const order = await Order.create({
      restaurant: restaurant._id,
      items: normalisedItems,
      reservation: {
        type: reservation?.type || 'dine-in',
        partySize: reservation?.partySize || 2,
        scheduledFor: reservation?.scheduledFor ? new Date(reservation.scheduledFor) : new Date(),
        specialRequest: reservation?.specialRequest,
      },
      customer: {
        name: customer?.name || 'Guest User',
        email: customer?.email,
        phone: customer?.phone,
      },
      payment: {
        method: payment?.method || 'online',
        status: initialPaymentStatus,
        reference: payment?.reference,
        provider: payment?.provider,
        amount: totalAmount,
        paymentIntentId: payment?.paymentIntentId,
      },
      status: 'pending',
      notes,
      taxes,
      fees,
      totalAmount,
      paymentHistory: [
        {
          status: initialPaymentStatus,
          amount: totalAmount,
          reference: payment?.reference,
          note: 'Order placed',
          processedAt: new Date(),
        },
      ],
    });

    const populatedOrder = await order.populate('restaurant', 'name slug cuisine address heroImage');

    res.status(201).json(populatedOrder);
    return undefined;
  } catch (error) {
    return next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'confirmed', reference, provider, amount, note, failureReason } = req.body;

    if (!PAYMENT_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (typeof amount === 'number') {
      order.payment.amount = amount;
      order.totalAmount = amount;
    }

    if (provider) {
      order.payment.provider = provider;
    }
    if (reference) {
      order.payment.reference = reference;
    }

    order.payment.status = status;
    if (status === 'confirmed') {
      order.payment.confirmedAt = new Date();
      order.status = order.status === 'pending' ? 'confirmed' : order.status;
      order.confirmedAt = order.confirmedAt || new Date();
      order.payment.failureReason = undefined;
    }
    if (status === 'failed') {
      order.payment.failureReason = failureReason || note || 'Payment failed';
    }
    if (status === 'refunded') {
      order.payment.failureReason = undefined;
    }

    appendPaymentHistory(order, {
      status,
      amount: order.payment.amount,
      reference: order.payment.reference || reference,
      note: note || (status === 'confirmed' ? 'Payment confirmed' : undefined),
    });

    await order.save();
    const populatedOrder = await order.populate('restaurant', 'name slug cuisine address heroImage');
    res.json(populatedOrder);
    return undefined;
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    if (status === 'confirmed') {
      order.confirmedAt = order.confirmedAt || new Date();
      if (order.payment.status === 'pending') {
        order.payment.status = 'authorized';
        appendPaymentHistory(order, {
          status: 'authorized',
          amount: order.payment.amount,
          reference: order.payment.reference,
          note: 'Order confirmed, awaiting payment',
        });
      }
    }

    if (status === 'completed') {
      order.completedAt = new Date();
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancellationReason = reason;
    }

    await order.save();
    const populatedOrder = await order.populate('restaurant', 'name slug cuisine address heroImage');
    res.json(populatedOrder);
    return undefined;
  } catch (error) {
    return next(error);
  }
};

export default {
  getOrders,
  createOrder,
  confirmPayment,
  updateOrderStatus,
};

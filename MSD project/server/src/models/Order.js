import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: String,
  },
  { _id: false }
);

const reservationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['dine-in', 'pickup'], default: 'dine-in' },
    partySize: { type: Number, min: 1, default: 2 },
    scheduledFor: { type: Date, required: true },
    specialRequest: String,
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ['online', 'wallet', 'card-on-arrival'], default: 'online' },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'confirmed', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: Number,
    reference: String,
    provider: String,
    paymentIntentId: String,
    confirmedAt: Date,
    failureReason: String,
  },
  { _id: false }
);

const paymentEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'authorized', 'confirmed', 'failed', 'refunded'],
      required: true,
    },
    amount: Number,
    reference: String,
    note: String,
    processedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [orderItemSchema], validate: (value) => value.length > 0 },
    reservation: reservationSchema,
    customer: customerSchema,
    payment: paymentSchema,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: String,
    totalAmount: { type: Number, required: true },
    taxes: Number,
    fees: Number,
    isMock: { type: Boolean, default: false },
    paymentHistory: { type: [paymentEventSchema], default: [] },
    confirmedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        // eslint-disable-next-line no-underscore-dangle
        ret.id = ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
      },
    },
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

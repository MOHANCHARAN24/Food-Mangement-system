import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    line1: String,
    area: String,
    city: String,
    state: String,
    postalCode: String,
  },
  { _id: false }
);

const deliveryEtaSchema = new mongoose.Schema(
  {
    min: Number,
    max: Number,
    unit: { type: String, default: 'mins' },
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,
    isVegetarian: Boolean,
    isVegan: Boolean,
    isGlutenFree: Boolean,
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    priceLevel: { type: Number, min: 1, max: 4 },
    description: String,
    address: addressSchema,
    heroImage: String,
    gallery: [String],
    highlights: [String],
    popularDishes: [String],
    tags: [String],
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    distanceKm: Number,
    deliveryEta: deliveryEtaSchema,
    averageOrderValue: Number,
    reservationDeposit: Number,
    isTopPick: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    menu: [menuItemSchema],
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

restaurantSchema.index({ name: 'text', cuisine: 'text', tags: 'text', highlights: 'text' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;

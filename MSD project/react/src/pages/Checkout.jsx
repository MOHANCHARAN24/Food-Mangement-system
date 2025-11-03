import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/format';

const initialReservation = {
  type: 'dine-in',
  partySize: 2,
  scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  specialRequest: '',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart, removeFromCart, placeOrder, clearCart } = useAppContext();
  const [reservation, setReservation] = useState(initialReservation);
  const [loading, setLoading] = useState(false);

  const restaurant = state?.restaurant;

  const totals = useMemo(() => {
    const subtotal = cart.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  }, [cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!restaurant) {
      toast.error('Select a restaurant before pre-ordering.');
      navigate('/restaurants');
      return;
    }
    if (!cart.length) {
      toast.error('Add dishes from the menu first.');
      return;
    }

    try {
      setLoading(true);
      await placeOrder({
        restaurantId: restaurant._id || restaurant.slug,
        reservation: {
          ...reservation,
          scheduledFor: new Date(reservation.scheduledFor).toISOString(),
        },
        payment: { method: 'online', status: 'pending' },
      });
      toast.success('Pre-order confirmed! Check your email for details.');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--compact checkout">
      <h1>Complete your pre-order</h1>
      <div className="checkout__grid">
        <section>
          <h2>Reservation preferences</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Experience type
              <select
                value={reservation.type}
                onChange={(event) => setReservation((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="dine-in">Dine-in</option>
                <option value="pickup">Pickup</option>
              </select>
            </label>

            <label>
              Party size
              <input
                type="number"
                min="1"
                value={reservation.partySize}
                onChange={(event) =>
                  setReservation((prev) => ({ ...prev, partySize: Number(event.target.value) }))
                }
              />
            </label>

            <label>
              When should we have it ready?
              <input
                type="datetime-local"
                value={reservation.scheduledFor}
                onChange={(event) =>
                  setReservation((prev) => ({ ...prev, scheduledFor: event.target.value }))
                }
              />
            </label>

            <label>
              Special requests
              <textarea
                rows={3}
                placeholder="Mention allergies, celebrations, or seating preference"
                value={reservation.specialRequest}
                onChange={(event) =>
                  setReservation((prev) => ({ ...prev, specialRequest: event.target.value }))
                }
              />
            </label>

            <button className="btn btn--primary" disabled={loading} type="submit">
              {loading ? 'Processing...' : 'Confirm & Pay' }
            </button>
          </form>
        </section>

        <aside>
          <div className="summary">
            <h2>Order summary</h2>
            {restaurant ? (
              <div className="summary__restaurant">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address?.area || restaurant.cuisine}</p>
              </div>
            ) : (
              <p>Select a restaurant to get started.</p>
            )}

            <ul className="summary__list">
              {cart.map((item) => (
                <li key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                    <button type="button" onClick={() => removeFromCart(item.name)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary__totals">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(totals.subtotal)}</strong>
              </div>
              <div>
                <span>Taxes & fees</span>
                <strong>{formatCurrency(totals.taxes)}</strong>
              </div>
              <div className="summary__total">
                <span>To pay</span>
                <strong>{formatCurrency(totals.total)}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

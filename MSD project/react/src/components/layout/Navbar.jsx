import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMapPin, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/orders', label: 'Orders' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/cashback', label: 'Rewards' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { location, cart, user } = useAppContext();

  return (
    <header className="navbar">
      <div className="navbar__branding" onClick={() => navigate('/')}> 
        <span className="navbar__logo">PreOrder</span>
        <span className="navbar__tagline">Book dining. Skip queues.</span>
      </div>

      <div className="navbar__location" role="button" tabIndex={0} onClick={() => navigate('/restaurants')}>
        <FiMapPin size={18} />
        <span>{location?.label || 'Select location'}</span>
      </div>

      <nav className="navbar__links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              ['navbar__link', isActive && 'navbar__link--active'].filter(Boolean).join(' ')
            }
            end={link.to === '/'}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__actions">
        <button type="button" className="chip" onClick={() => navigate('/checkout')}>
          <FiShoppingBag />
          <span>Preorder</span>
          {cart.length > 0 && <span className="chip__badge">{cart.length}</span>}
        </button>
        <button
          type="button"
          className="chip"
          onClick={() => navigate(user ? '/profile' : '/login', { state: { from: pathname } })}
        >
          <FiUser />
          <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

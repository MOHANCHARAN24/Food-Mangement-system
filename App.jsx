
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Login() {
  return (
    <div className="container">
      <h2>Login</h2>
      <form>
        <label>Email:</label>
        <input type="email" placeholder="Enter email" />
        <label>Password:</label>
        <input type="password" placeholder="Enter password" />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

function Signup() {
  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form>
        <label>Name:</label>
        <input type="text" placeholder="Enter name" />
        <label>Email:</label>
        <input type="email" placeholder="Enter email" />
        <label>Password:</label>
        <input type="password" placeholder="Enter password" />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

function Home() {
  return (
    <div className="container">
      <h2>Welcome to Food & Table Pre-Ordering</h2>
      <p>Find the best restaurants and pre-order your food or table easily!</p>
      <Link to="/restaurants"><button>See Restaurants</button></Link>
    </div>
  );
}

function RestaurantList() {
  const [restaurants, setRestaurants] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          // Simulate API call
          fetch(`/api/restaurants?lat=${latitude}&lng=${longitude}`)
            .then(res => res.ok ? res.json() : Promise.reject("API error"))
            .then(data => {
              setRestaurants(data.restaurants || []);
              setLoading(false);
            })
            .catch(() => {
              // Fallback mock data
              setRestaurants([
                { id: 1, name: "Tomato Restaurant" },
                { id: 2, name: "Spicy House" },
                { id: 3, name: "Green Leaf" }
              ]);
              setLoading(false);
              setError("Could not fetch from API, showing local results.");
            });
        },
        () => {
          setRestaurants([
            { id: 1, name: "Tomato Restaurant" },
            { id: 2, name: "Spicy House" },
            { id: 3, name: "Green Leaf" }
          ]);
          setLoading(false);
          setError("Location access denied, showing local results.");
        }
      );
    } else {
      setRestaurants([
        { id: 1, name: "Tomato Restaurant" },
        { id: 2, name: "Spicy House" },
        { id: 3, name: "Green Leaf" }
      ]);
      setLoading(false);
      setError("Geolocation not supported, showing local results.");
    }
  }, []);

  return (
    <div className="container">
      <h2>Restaurants Near You</h2>
      {loading && <p>Loading restaurants...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {restaurants.map(r => (
          <li key={r.id}><Link to={`/restaurant/${r.id}`}>{r.name}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function RestaurantDetails({ id }) {
  return (
    <div className="container">
      <h2>Restaurant Details (ID: {id})</h2>
      <p>Menu, reviews, and more info here.</p>
      <Link to={`/preorder/${id}`}>Pre-Order Food/Table</Link>
    </div>
  );
}

function PreOrder({ id }) {
  return (
    <div className="container">
      <h2>Pre-Order at Restaurant {id}</h2>
      <form>
        <label>Order Type:</label>
        <select>
          <option>Food</option>
          <option>Table</option>
        </select>
        <label>Advance Payment:</label>
        <input type="number" placeholder="Enter amount" />
        <button type="submit">Pay & Confirm</button>
      </form>
    </div>
  );
}

function NotFound() {
  return <div className="container"><h2>Page Not Found</h2></div>;
}

function App() {
  // React state for profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  React.useEffect(() => {
    const handleClickOutside = () => setShowProfileDropdown(false);
    if (showProfileDropdown) {
      document.body.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <Router>
      <nav style={{
        padding: '10px',
        background: '#eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link> | <Link to="/restaurants">Restaurants</Link>
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            style={{ padding: '8px 16px', borderRadius: '20px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              setShowProfileDropdown(v => !v);
            }}
          >
            Profile &#x25BC;
          </button>
          {showProfileDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              minWidth: '180px',
              zIndex: 1000
            }}>
              <Link to="/account" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#333' }}>Account</Link>
              <Link to="/orders" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#333' }}>Orders</Link>
              <Link to="/payments" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#333' }}>Payments</Link>
              <Link to="/cashbacks" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#333' }}>Cashbacks</Link>
              <Link to="/wallets" style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#333' }}>Wallets</Link>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailsWrapper />} />
        <Route path="/preorder/:id" element={<PreOrderWrapper />} />
        <Route path="/account" element={<div className="container"><h2>Account</h2></div>} />
        <Route path="/orders" element={<div className="container"><h2>Orders</h2></div>} />
        <Route path="/payments" element={<div className="container"><h2>Payments</h2></div>} />
        <Route path="/cashbacks" element={<div className="container"><h2>Cashbacks</h2></div>} />
        <Route path="/wallets" element={<div className="container"><h2>Wallets</h2></div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function RestaurantDetailsWrapper() {
  const id = window.location.pathname.split('/').pop();
  return <RestaurantDetails id={id} />;
}
function PreOrderWrapper() {
  const id = window.location.pathname.split('/').pop();
  return <PreOrder id={id} />;
}

export default App;


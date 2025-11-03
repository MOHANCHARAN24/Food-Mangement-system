import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div className="container">
      <h2>Welcome to Food & Table Pre-Ordering</h2>
      <p>Find the best restaurants and pre-order your food or table easily!</p>
      <Link to="/restaurants"><button>See Restaurants</button></Link>
    </div>
  );
}

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={e => { e.preventDefault(); navigate('/'); }}>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={e => { e.preventDefault(); navigate('/'); }}>
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" />
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

function RestaurantList() {
  const [restaurants] = React.useState([
    { id: 1, name: "Tomato Restaurant" },
    { id: 2, name: "Spicy House" },
    { id: 3, name: "Green Leaf" }
  ]);
  return (
    <div className="container">
      <h2>Restaurants Near You</h2>
      <ul>
        {restaurants.map(r => (
          <li key={r.id}><Link to={`/restaurant/${r.id}`}>{r.name}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function RestaurantDetails() {
  const { id } = useParams();
  return (
    <div className="container">
      <h2>Restaurant Details (ID: {id})</h2>
      <p>Menu, reviews, and more info here.</p>
      <Link to={`/preorder/${id}`}>Pre-Order Food/Table</Link>
    </div>
  );
}

function PreOrder() {
  const { id } = useParams();
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

function Profile() {
  return <div className="container"><h2>Profile</h2><p>Profile details here.</p></div>;
}
function Orders() {
  return <div className="container"><h2>Orders</h2><p>Order history here.</p></div>;
}
function Payments() {
  return <div className="container"><h2>Payments</h2><p>Payments info here.</p></div>;
}
function Wallet() {
  return <div className="container"><h2>Wallet</h2><p>Wallet info here.</p></div>;
}
function Account() {
  return <div className="container"><h2>Account</h2><p>Account info here.</p></div>;
}
function Cashback() {
  return <div className="container"><h2>Cashback</h2><p>Cashback info here.</p></div>;
}
function Wallets() {
  return <div className="container"><h2>Wallets</h2><p>Wallets info here.</p></div>;
}
function NotFound() {
  return <div className="container"><h2>404 - Page Not Found</h2></div>;
}

function App() {
  return (
    <Router>
      <nav className="navbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: '#43a047', justifyContent: 'center' }}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/orders" className="nav-link">Orders</Link>
        <Link to="/payments" className="nav-link">Payments</Link>
        <Link to="/wallet" className="nav-link">Wallet</Link>
        <Link to="/account" className="nav-link">Account</Link>
        <Link to="/cashback" className="nav-link">Cashback</Link>
        <Link to="/wallets" className="nav-link">Wallets</Link>
        <Link to="/restaurants" className="nav-link">Restaurants</Link>
      </nav>
      <div style={{ marginTop: '2rem', minHeight: '350px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cashback" element={<Cashback />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/preorder/:id" element={<PreOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


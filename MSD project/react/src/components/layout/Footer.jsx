import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div>
      <h4>PreOrder</h4>
      <p>Crafted to help you discover, reserve, and dine at the best restaurants around you.</p>
    </div>
    <div>
      <h5>For Food Lovers</h5>
      <ul>
        <li>Discover curated menus</li>
        <li>Reserve chef tables</li>
        <li>Earn cashback on every visit</li>
      </ul>
    </div>
    <div>
      <h5>Need Help?</h5>
      <ul>
        <li>support@preorder.io</li>
        <li>+91 98765 43210</li>
        <li>Live chat 24/7</li>
      </ul>
    </div>
    <p className="footer__credits">© {new Date().getFullYear()} PreOrder Dining Pvt. Ltd. All rights reserved.</p>
  </footer>
);

export default Footer;

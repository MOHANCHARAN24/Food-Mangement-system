import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-shell__content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ user, onLogout }) => {
  return (
    <div className="main-layout">
      <Header user={user} onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

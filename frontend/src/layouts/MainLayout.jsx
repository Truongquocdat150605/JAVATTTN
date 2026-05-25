import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh", padding: "20px 0" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import ThankYou from "./components/ThankYou";
import {
  sampleCustomers,
  sampleItems,
  discountCoupons,
} from "./data/sampleData";

const App = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(sampleItems);
  const [orderHistory, setOrderHistory] = useState([]);
  const [coupons, setCoupons] = useState(discountCoupons);

  const handleLogin = (username, password) => {
    const foundUser = sampleCustomers.find(
      (customer) =>
        customer.username === username && customer.password === password
    );
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleLogout = () => setUser(null);

  const handleOrderComplete = () => {
    // Redirect to Thank You page after order completion
    setTimeout(() => {
      window.location.href = "/thank-you";
    }, 1000);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : user.role === "Admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/customer-dashboard" />
            )
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin-dashboard"
          element={
            user && user.role === "Admin" ? (
              <AdminDashboard
                onLogout={handleLogout}
                items={items}
                setItems={setItems}
                coupons={coupons}
                orderHistory={orderHistory}
                customers={sampleCustomers}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Customer Dashboard Route */}
        <Route
          path="/customer-dashboard"
          element={
            user && user.role === "Customer" ? (
              <CustomerDashboard
                onLogout={handleLogout}
                items={items}
                setItems={setItems}
                orderHistory={orderHistory}
                setOrderHistory={setOrderHistory}
                user={user}
                coupons={coupons}
                setCoupons={setCoupons}
                onOrderComplete={handleOrderComplete}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Thank You Page */}
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
};

export default App;
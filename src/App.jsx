import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
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
  const [orderHistory, setOrderHistory] = useState({});
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
    navigate("/thank-you");
  };

  return (
    <Router> {/* Wrap your entire app with BrowserRouter */}
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : user.role === "Admin" ? (
              <AdminDashboard
                onLogout={handleLogout}
                items={items}
                setItems={setItems}
                coupons={coupons}
                orderHistory={orderHistory}
              />
            ) : (
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
            )
          }
        />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
};

export default App;
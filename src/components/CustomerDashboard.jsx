import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = ({
  onLogout,
  items,
  setItems,
  orderHistory,
  setOrderHistory,
  user,
  coupons,
  setCoupons,
}) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const newTotalCost = cart.reduce(
      (total, item) => total + item.finalPrice,
      0
    );
    setTotalCost(newTotalCost);
  }, [cart]);

  const addToCart = (item) => {
    if (item.quantity > 0) {
      let itemCost = item.price;
      if (item.discountApplicable) {
        itemCost = item.price * 0.9; // Apply a 10% discount
      }

      const updatedCart = [...cart, { ...item, finalPrice: itemCost }];
      setCart(updatedCart);

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      alert("Out of stock!");
    }
  };

  const applyCoupon = () => {
    if (coupon in coupons && coupons[coupon].remainingUses > 0) {
      const discount = totalCost * (coupons[coupon].discount / 100);
      setTotalCost(totalCost - discount);

      alert(`Coupon applied! Discount: ${coupons[coupon].discount}%`);
      setCoupons((prev) => ({
        ...prev,
        [coupon]: {
          ...prev[coupon],
          remainingUses: prev[coupon].remainingUses - 1,
        },
      }));
    } else {
      alert("Invalid or expired coupon!");
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const order = {
      customer: user.username,
      items: cart,
      totalCost: totalCost.toFixed(2),
      date: new Date().toLocaleString(),
    };

    setOrderHistory((prev) => [...prev, order]);
    setCart([]);
    setTotalCost(0);

    alert("Order placed successfully!");

    const redirectToLogin = true;
    if (redirectToLogin) {
      navigate("/login");
    } else {
      navigate("/thank-you");
    }
    onLogout();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Customer Dashboard</h2>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white p-2 rounded mb-6"
      >
        Logout
      </button>

      <h3 className="text-2xl font-semibold mb-4">Items</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span>
              {item.name} - ${item.price} ({item.quantity} left)
              {item.discountApplicable && (
                <span> (10% discount applicable)</span>
              )}
            </span>
            <button
              onClick={() => addToCart(item)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-2xl font-semibold mt-6 mb-4">Cart</h3>
      <ul className="space-y-3">
        {cart.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>
              {item.name} - ${item.finalPrice.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <h4 className="text-xl font-semibold mt-4">
        Total Cost: ${totalCost.toFixed(2)}
      </h4>

      <div className="mt-6 flex items-center space-x-3">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="p-2 border rounded w-64"
        />
        <button
          onClick={applyCoupon}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Coupon
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={placeOrder}
          className="bg-yellow-500 text-white px-6 py-3 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

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
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Recompute the total cost when cart changes
    const newTotalCost = cart.reduce((total, item) => total + item.finalPrice, 0);
    setTotalCost(newTotalCost);
  }, [cart]);

  const addToCart = (item) => {
    if (item.quantity > 0) {
      let itemCost = item.price;
      if (item.discountApplicable) {
        itemCost = item.price * 0.9; // Apply a 10% discount if eligible
      }

      // Add the item to the cart
      const updatedCart = [...cart, { ...item, finalPrice: itemCost }];
      setCart(updatedCart);

      // Decrease the stock of the item
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === item.id) {
            return { ...i, quantity: i.quantity - 1 };
          } else {
            return i;
          }
        })
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
        [coupon]: { ...prev[coupon], remainingUses: prev[coupon].remainingUses - 1 },
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

    // Redirect to ThankYou page or main login page
    const redirectToLogin = true; // Set to true if you want to go to login page, or false to go to ThankYou page

    if (redirectToLogin) {
      navigate("/login"); // Redirect to login page after order
    } else {
      navigate("/thank-you"); // Redirect to ThankYou page
    }
    onLogout(); // Log out the user after placing the order
  };

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <button onClick={onLogout}>Logout</button>

      <h3>Items</h3>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.id}>
              {item.name} - ${item.price} ({item.quantity} left)
              {item.discountApplicable && <span> (10% discount applicable)</span>}
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </li>
          );
        })}
      </ul>

      <h3>Cart</h3>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.finalPrice.toFixed(2)}
          </li>
        ))}
      </ul>

      <h4>Total Cost: ${totalCost.toFixed(2)}</h4>

      <input
        type="text"
        placeholder="Enter coupon code"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />
      <button onClick={applyCoupon}>Apply Coupon</button>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default CustomerDashboard;
import React from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div>
      <h1>Thank You for Your Order!</h1>
      <p>Your order has been placed successfully.</p>
      <Link to="/">Go back to dashboard</Link>
    </div>
  );
};

export default ThankYou;
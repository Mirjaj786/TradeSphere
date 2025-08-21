import React, { useState } from "react";
import { useGeneralContext } from "./GeneralContext";
import "./BuyActionWindow.css";
import axios from "axios";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useGeneralContext();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("0.0");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle buy order logic here
    console.log(`Buying ${quantity} shares of ${uid} at ${price}`);
    closeBuyWindow();
  };

  const hanledBuyBtn = () => {
    axios
      .post("http://localhost:3002/neworders", {
        name: uid,
        qty: quantity,
        price: price,
        mode: "BUY",
      })
      .then((res) => {
        console.log("Order placed:", res.data);
        alert("Order placed successfully");
        closeBuyWindow();
      })
      .catch((err) => {
        console.error("Error placing order:", err);
      });
  };

  return (
    <div className="buy-window-overlay ">
      <div className="buy-window">
        <div className="buy-window-header">
          <h3>Buy {uid}</h3>
          <button onClick={closeBuyWindow} className="close-btn">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ width: "95%" }}>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={closeBuyWindow}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="buy-btn" onClick={hanledBuyBtn}>
              Buy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyActionWindow;

// import React, { useState } from "react";
// import { useGeneralContext } from "./GeneralContext";
// import "./BuyActionWindow.css";
// import axios from "axios";

// const BuyActionWindow = ({ uid }) => {
//   const { closeBuyWindow } = useGeneralContext();
//   const [quantity, setQuantity] = useState(1);
//   const [price, setPrice] = useState(0.0);

//   const handleBuy = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:3002/neworders", {
//         name: uid,
//         qty: quantity,
//         price: price,
//         mode: "BUY",
//       });

//       console.log("Order placed:", res.data);
//       localStorage.setItem("flash_success", "Order placed successfully");
//       closeBuyWindow();
//     } catch (err) {
//       console.error("Error placing order:", err);
//       localStorage.setItem("flash_error", "Failed to place order");
//     }
//   };

//   return (
//     <div className="buy-window-overlay">
//       <div className="buy-window">
//         <div className="buy-window-header">
//           <h3>Buy {uid}</h3>
//           <button onClick={closeBuyWindow} className="close-btn">
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleBuy} style={{ width: "95%" }}>
//           <div className="form-group">
//             <label>Quantity:</label>
//             <input
//               type="number"
//               value={quantity}
//               onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
//               min="1"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Price:</label>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(parseFloat(e.target.value))}
//               step="0.01"
//               required
//             />
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={closeBuyWindow}
//               className="cancel-btn"
//             >
//               Cancel
//             </button>
//             <button type="submit" className="buy-btn">
//               Buy
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BuyActionWindow;

import React, { useState } from "react";
import { useGeneralContext } from "./GeneralContext";
import axios from "axios";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useGeneralContext();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0.0);

  const handleBuy = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3002/neworders", {
        name: uid,
        qty: quantity,
        price: price,
        mode: "BUY",
      });

      console.log("Order placed:", res.data);
      localStorage.setItem("flash_success", "Order placed successfully");
      closeBuyWindow();
    } catch (err) {
      console.error("Error placing order:", err);
      localStorage.setItem("flash_error", "Failed to place order");
    }
  };

  return (
    <div className="buy-window-overlay">
      <div className="buy-window">
        <div className="buy-window-header">
          <h3>Buy {uid}</h3>
          <button onClick={closeBuyWindow} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleBuy}>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
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
            <button type="submit" className="buy-btn">
              Buy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyActionWindow;



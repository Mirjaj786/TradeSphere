import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3002/orders");
        if (isMounted) setOrders(res.data);
        console.log("Orders fetched:", res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false; // cleanup flag
    };
  }, []);

  if (loading) {
    return (
      <div className="orders">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <a href="/" className="btn">
            Get started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={idx}>
                <td>{o.name}</td>
                <td>{o.qty}</td>
                <td>{Number(o.price).toFixed(2)}</td>
                <td>{o.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;

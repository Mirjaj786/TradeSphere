import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPositions = async () => {
      try {
        const res = await axios.get("http://localhost:3002/addpositions", {
          withCredentials: true,
        });
        if (isMounted) setPositionData(res.data);
        console.log("Fetched positions:", res.data);
      } catch (err) {
        console.error("Failed to fetch positions:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPositions();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Loading positions...</p>;
  }

  if (!positionData.length) {
    return <p>No positions available.</p>;
  }

  return (
    <>
      <h3 className="title">Positions ({positionData.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {positionData.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;

// src/pages/OrderPage.jsx
import React from "react";
import { useOrder } from "../context/OrderContext";

export default function OrderPage() {
  const { orders } = useOrder();

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Order #{index + 1}</h2>
              <p><strong>Date:</strong> {order.date}</p>
              <p><strong>Payment:</strong> {order.paymentMethod.toUpperCase()}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>

              <ul className="mt-3 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.title} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

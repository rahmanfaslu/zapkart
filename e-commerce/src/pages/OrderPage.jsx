// src/pages/OrderPage.jsx
import React from "react";
import { useOrder } from "../context/OrderContext";
import { FaBoxOpen, FaCalendarAlt, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

export default function OrderPage() {
  const { orders } = useOrder();

   return (
    <section className="bg-gradient-to-tr from-gray-100 to-gray-200 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-10">🛍️ Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-2xl font-medium">
            <FaBoxOpen className="mx-auto text-5xl mb-4 text-blue-500" />
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 border border-blue-200 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">🧾 Order #{index + 1}</h2>
                  <p className="text-lg text-gray-600 flex items-center gap-2 mt-2 md:mt-0">
                    <FaCalendarAlt className="text-blue-600" /> {order.date}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-800 mb-3">
                  <div className="flex items-start gap-3">
                    <FaMoneyCheckAlt className="text-green-600 text-xl mt-1" />
                    <div>
                      <span className="font-semibold">Payment:</span>{" "}
                      <span className="uppercase">{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-red-500 text-xl mt-1" />
                    <div>
                      <span className="font-semibold">Address:</span> {order.address}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-start gap-3">
                    <span className="font-semibold text-xl">Total:</span> ₹{order.total}
                  </div>
                </div>

                <hr className="my-4 border-gray-300" />

                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">🛒 Items Ordered:</h3>
                  <ul className="list-disc list-inside text-gray-800 text-lg space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{item.title}</span> — ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

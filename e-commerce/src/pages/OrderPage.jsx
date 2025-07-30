import React from "react";
import { FaBoxOpen, FaCalendarAlt, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";

export default function OrderPage() {
  // Mock orders data for demonstration
  const orders = [
    {
      date: "2024-01-15",
      paymentMethod: "card",
      address: "123 Main St, New York, NY 10001",
      total: 75000,
      items: [
        { title: "iPhone 15 Pro", price: 50000 },
        { title: "AirPods Pro", price: 25000 }
      ]
    },
    {
      date: "2024-01-10",
      paymentMethod: "cod",
      address: "456 Oak Avenue, Los Angeles, CA 90210",
      total: 120000,
      items: [
        { title: "MacBook Air M3", price: 120000 }
      ]
    }
  ];

  // Function to format date as "MMM DD, YYYY" (e.g., "Jan 15, 2024")
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="bg-gradient-to-tr from-gray-100 to-gray-200 min-h-screen p-3 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-blue-800 mb-6 md:mb-10">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-xl md:text-2xl font-medium">
            <FaBoxOpen className="mx-auto text-4xl md:text-5xl mb-4 text-blue-500" />
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4 md:space-y-8">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-4 md:p-6 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">🧾 Order #{index + 1}</h2>
                  <p className="text-sm md:text-base text-gray-600 flex items-center gap-1 md:gap-2">
                    <FaCalendarAlt className="text-blue-600 text-xs md:text-base" />
                    {formatDate(order.date)}
                  </p>
                </div>

                {/* Main content area with flex layout */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Left side - Order details */}
                  <div className="md:w-2/3 space-y-3">
                    {/* Total */}
                    <div className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      Total: ₹{order.total.toLocaleString()}
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-gray-800">
                      <div className="flex items-start gap-2 md:gap-3">
                        <FaMoneyCheckAlt className="text-green-600 text-sm md:text-lg mt-1 flex-shrink-0" />
                        <div className="text-sm md:text-base">
                          <span className="font-semibold">Payment:</span>{" "}
                          <span className="uppercase">{order.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3">
                        <FaMapMarkerAlt className="text-red-500 text-sm md:text-lg mt-1 flex-shrink-0" />
                        <div className="text-sm md:text-base">
                          <span className="font-semibold">Address:</span>{" "}
                          <span className="break-words">{order.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Ordered items */}
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2">🛒 Items Ordered:</h3>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="font-medium text-sm text-gray-800 truncate">{item.title}</span>
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">₹{item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
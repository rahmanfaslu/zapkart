import React, { useState } from "react";

const FAQs = [
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email at support@shingify.in or call us at +91-9876543210. We're available Mon-Sat, 10AM to 6PM.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for unused and unopened products. Refunds will be processed within 5-7 business days.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use advanced encryption and never share your data with third parties without consent.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes, we offer Cash on Delivery (COD) on most products depending on your location.",
  },
];

export default function PolicyPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center">Policies & Support</h1>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>Email: <a href="mailto:support@shingify.in" className="text-blue-600 underline">faslur501@gmail.com</a></p>
        <p>Phone: +91-9207119149</p>
        <p>Address: Shingify.in, kinfra Park, kakkanchery, kerela</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Privacy Policy</h2>
        <p>
          At Shingify.in, your privacy is important to us. We collect your information only to enhance your shopping experience and do not sell your data to third parties.
        </p>
        <p>
          All transactions are encrypted and secure. You can request data deletion at any time by contacting support@shingify.in.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Return Policy</h2>
        <p>
          We offer hassle-free returns within 7 days of delivery. Items must be in original condition and packaging. Refunds are processed within 5-7 business days of product inspection.
        </p>
        <p>
          For initiating a return, contact us at returns@shingify.in with your order ID.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQs</h2>
        {FAQs.map((faq, index) => (
          <div key={index} className="border-b py-2">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left text-lg font-medium flex justify-between items-center"
            >
              {faq.question}
              <span>{openFAQ === index ? "−" : "+"}</span>
            </button>
            {openFAQ === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

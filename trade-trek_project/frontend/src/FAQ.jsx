import React, { useState } from 'react';

const FAQ = () => {
  // State to track which FAQ item is open
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle function to handle opening/closing of FAQ items
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ data
  const faqs = [
    { question: "What is TradeTrek?", answer: "TradeTrek is a platform to connect users with skilled tradespeople for repairs." },
    { question: "How do I sign up?", answer: "You can sign up by filling out the sign-up form and selecting your user type." },
    { question: "Is there a fee to use TradeTrek?", answer: "Currently, using TradeTrek is free for all users." },
  ];

  return (
    <section className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md my-10">
      <h2 className="text-center text-3xl font-bold text-gray-600 mb-8">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4 border-b-2 border-gray-200">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left font-semibold text-xl text-gray-700 py-4 px-4 hover:bg-gray-200 focus:outline-none"
          >
            {faq.question}
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-gray-600">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default FAQ;

import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  const faqs = [
    {
      question: "What is the purpose of this organization?",
      answer:
        "Our mission is to support communities through various programs including education, food distribution, rehabilitation, and emergency assistance.",
    },
    {
      question: "How can I volunteer?",
      answer:
        "You can volunteer by joining our team through the Join Our Team page. We welcome passionate individuals from all backgrounds.",
    },
    {
      question: "Where does the donation money go?",
      answer:
        "All donations directly fund essential relief work—food kits, medical help, rebuilding homes, and supporting individuals in need.",
    },
    {
      question: "How do I request help?",
      answer:
        "You can submit a help request through our Help Required page. Our team reviews all submissions and responds as quickly as possible.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20">
      {/* Title */}
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-14">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-2xl p-6 cursor-pointer transition"
          >
            {/* Question */}
            <div
              className="flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>

              <span className="text-xl text-gray-700 transition-transform duration-300">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 mt-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
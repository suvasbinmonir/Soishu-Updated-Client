import { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const faqs = [
  {
    question: 'What kind of shoes does SOISHU offer?',
    answer:
      'We specialize in handcrafted men’s shoes designed for everyday elegance and lasting comfort, from casual wear to smart classics.',
  },
  {
    question: 'Are your shoes made in Bangladesh?',
    answer:
      'Yes. All SOISHU shoes are proudly made in Bangladesh using carefully selected materials and skilled craftsmanship.',
  },
  {
    question: 'How do I know my size?',
    answer:
      'We follow standard size charts. You can refer to our size guide before ordering, or message us directly for help choosing the right fit.',
  },
  {
    question: 'Do you offer home delivery?',
    answer:
      'Yes, we deliver all over Bangladesh through reliable courier partners. Delivery time typically takes 2 - 4 working days depending on your location.',
  },
  {
    question: 'Is Cash on Delivery available?',
    answer:
      'Absolutely. We offer Cash on Delivery (COD) nationwide for your convenience.',
  },
  {
    question: "Can I exchange my shoes if the size doesn't fit?",
    answer:
      'Yes. We offer a hassle-free size exchange within 3 days of delivery, provided the product is unused and in original condition.',
  },
  {
    question: 'How can I place an order?',
    answer:
      'You can place an order directly through our Facebook inbox, website, or by calling/message on our provided contact number.',
  },
  {
    question: 'Do you offer any warranty?',
    answer:
      'We ensure quality in every pair. If there’s a manufacturing defect, we’ll offer a free replacement within 7 days of purchase.',
  },
  {
    question: 'Can I return my shoes?',
    answer:
      'Currently, we offer exchange but not full refunds unless there’s a product fault. Please check the size and design carefully before confirming.',
  },
  {
    question: 'How do I take care of my SOISHU shoes?',
    answer:
      'Keep them away from water and direct sunlight. Use a soft brush or cloth for cleaning. For leather products, apply conditioner or polish occasionally for long life.',
  },
];

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="max-w-[1440px] px-5 mx-auto mb-16">
        <div className="flex justify-center items-center flex-col mb-16">
          <p className="uppercase bg-[#ecdbcd] text-[#b26729] w-fit text-center px-2.5 py-0.5 text-sm rounded-full mb-3 md:mb-6">
            Frequently ask questions
          </p>
          <h1 className="lg:text-5xl text-4xl font-semibold text-center">
            You ask? We answer
          </h1>
        </div>
        <div className="w-full mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-[#ecdbcd] pb-3 cursor-pointer"
            >
              <div
                className="flex justify-between items-center gap-8 py-3"
                onClick={() => toggleFAQ(index)}
              >
                <p className="w-full text-[#2f3133] text-left font-medium lg:text-xl text-lg text-darkIndigo">
                  {faq.question}
                </p>
                {openIndex === index ? (
                  <AiOutlineMinus className="w-5 h-5 text-[#2f3133]" />
                ) : (
                  <AiOutlinePlus className="w-5 h-5 text-[#2f3133]" />
                )}
              </div>
              <div
                className={`transition-all overflow-hidden duration-300 ${
                  openIndex === index
                    ? 'max-h-40 opacity-100 mb-3'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { ChevronRight } from "lucide-react";

// Array of frequently asked questions
const faqs = [
  "What is online counselling, and how does it work?",
  "What types of issues can I seek help for through online counselling?",
  "What should I expect during an online counselling session?",
  "How do I schedule an appointment?",
  "Is online counselling confidential and secure?",
  "How long does a counselling session usually last?",
  "Can I choose or change my therapist later?",
];

export default function FaqSection() {
  return (
    <section className="bg-[#F3FFF8] py-10">
       
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section heading */}
        <h2 className="text-4xl font-bold text-gray-800 mb-10">
          Any Questions?
        </h2>

        {/* FAQ list with dividers between items */}
        <div className="divide-y divide-gray-300">
          {faqs.map((q, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-8 cursor-pointer group transition-colors"
            >
              {/* Question text */}
              <p className="text-lg font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                {q}
              </p>

              {/* Chevron arrow icon */}
              <ChevronRight
                size={24}
                className="text-gray-600 group-hover:text-green-700 group-hover:translate-x-1 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

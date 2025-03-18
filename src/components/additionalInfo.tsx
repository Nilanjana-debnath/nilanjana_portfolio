import React from "react";
import additionalInfo from "@/data/additionalInfo.json";

export default function AdditionalInfo() {
  const faqData = additionalInfo.questions_and_answers;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Additional Information</h1>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {item.question}
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
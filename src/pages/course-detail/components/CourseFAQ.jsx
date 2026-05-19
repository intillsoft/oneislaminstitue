import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseFAQ = () => {
  const faqs = [
    {
      question: "Is this course self-paced?",
      answer: "Yes, once you enroll, you have lifetime access to the materials and can progress at your own speed."
    },
    {
      question: "Do I get a certificate upon completion?",
      answer: "Absolutely. A verified certificate of completion will be issued once you finish all modules and pass the final assessment."
    },
    {
      question: "Are there any prerequisites?",
      answer: "Most of our foundational courses are open to everyone. Advanced modules may require completion of Level 1 courses."
    },
    {
      question: "How do I access the community?",
      answer: "You'll receive an invite to our exclusive student Discord server immediately after enrollment."
    }
  ];

  return (
    <section className="py-20 border-t border-[var(--color-border-primary)] dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white mb-10 text-center tracking-tight">Common Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[var(--color-border-primary)] dark:border-slate-800 overflow-hidden transition-all hover:border-[var(--color-primary)]/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-bold text-[var(--color-text-primary)] dark:text-white text-base">{faq.question}</span>
        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors ${isOpen ? 'text-[var(--color-primary)] dark:text-[var(--color-primary)]' : 'text-slate-400'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-6 pt-0 text-[var(--color-text-secondary)] dark:text-slate-400 leading-relaxed text-sm">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseFAQ;

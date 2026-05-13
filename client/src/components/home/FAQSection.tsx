'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Section, Heading } from '@/design-system/components';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'How does the AI ensure zero bias?',
    answer:
      'Our proprietary IQ Matching Engine uses engineered fairness layers that strip identifying information and focus purely on merit and performance signals, ensuring 99.8% precision while maintaining complete compliance with diversity hiring standards.',
  },
  {
    question: 'Can we integrate with our current ATS?',
    answer:
      'Yes. HireIQ BD provides seamless integration with all major ATS systems through our RESTful API. Enterprise customers also receive dedicated technical support for custom integrations.',
  },
  {
    question: 'What is Agentic Recruiting exactly?',
    answer:
      'Agentic Recruiting refers to our autonomous AI agents that source, engage, and nurture candidates across global talent networks 24/7 without manual intervention, dramatically reducing time-to-hire.',
  },
  {
    question: 'How do I get started with HireIQ BD?',
    answer:
      'Simply create an account, choose your subscription plan, and our AI engine will begin analyzing your requirements. Enterprise customers receive dedicated onboarding and a talent engineer.',
  },
];

export default function FAQSection() {
  return (
    <Section
      id="faq"
      className="relative overflow-hidden"
    >
      {/* HEADER */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 mb-5 px-5 py-2 rounded-full border border-primary/20 bg-primary/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <span className="text-primary text-xs font-bold uppercase tracking-[0.35em]">
              Intelligence Support
            </span>
          </div>

          <Heading level={2}>
            Frequently Asked <span className="text-primary italic">Questions</span>
          </Heading>

          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed">
            Answers to the most frequently asked questions regarding HireIQ BD AI-powered recruitment and enterprise solutions.
          </p>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-5xl mx-auto">
        <Accordion className="space-y-5">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-border/60
                  bg-card/60
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-primary/20
                "
              >
                <AccordionTrigger
                  className="
                    group
                    w-full
                    px-5
                    md:px-8
                    py-6
                    md:py-7
                    hover:no-underline
                    [&>svg]:hidden
                    [&_[data-lucide]]:hidden
                    cursor-pointer
                  "
                >
                  <div className="flex items-center gap-4 md:gap-6 w-full">
                    {/* NUMBER */}
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        shrink-0
                        w-14
                        h-14
                        md:w-16
                        md:h-16
                        rounded-2xl
                        border
                        border-primary/15
                        bg-primary/5
                        text-primary
                        text-xl
                        font-bold
                      "
                    >
                      {`0${index + 1}`}
                    </div>

                    {/* QUESTION */}
                    <div className="flex-1 text-left">
                      <h3
                        className="
                          text-base
                          md:text-xl
                          font-semibold
                          leading-relaxed
                          text-foreground
                        "
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* CUSTOM PLUS ICON */}
                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        shrink-0
                        w-11
                        h-11
                        rounded-full
                        border
                        border-primary/20
                        bg-primary/5
                        transition-all
                        duration-300
                        group-data-[state=open]:rotate-45
                        group-data-[state=open]:bg-primary
                      "
                    >
                      <Plus
                        size={18}
                        className="
                          text-primary
                          transition-all
                          duration-300
                          group-data-[state=open]:text-black
                        "
                      />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent
                  className="
                    px-5
                    md:px-8
                    pb-7
                    pt-0
                  "
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* ALIGN SPACE */}
                    <div className="w-14 md:w-16 shrink-0" />

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="h-px w-full bg-border/50 mb-5" />

                      <p
                        className="
                          text-sm
                          md:text-base
                          leading-8
                          text-muted-foreground
                        "
                      >
                        {faq.answer}
                      </p>
                    </div>

                    {/* RIGHT ALIGN */}
                    <div className="w-11 shrink-0" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
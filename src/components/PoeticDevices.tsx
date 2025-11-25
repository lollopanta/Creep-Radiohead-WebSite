import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ContentData } from '../types';

interface PoeticDevicesProps {
  content: ContentData['poeticDevices'];
}

export default function PoeticDevices({ content }: PoeticDevicesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="py-20 px-4"
      aria-labelledby="poetic-devices-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="poetic-devices-heading"
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Metaphors */}
          <DeviceSection
            title={content.metaphors.title}
            examples={content.metaphors.examples}
            isInView={isInView}
            delay={0.1}
          />

          {/* Hyperbole */}
          <DeviceSection
            title={content.hyperbole.title}
            examples={content.hyperbole.examples}
            isInView={isInView}
            delay={0.2}
          />

          {/* Personification */}
          <DeviceSection
            title={content.personification.title}
            examples={content.personification.examples}
            isInView={isInView}
            delay={0.3}
          />

          {/* Assonance */}
          <DeviceSection
            title={content.assonance.title}
            examples={content.assonance.examples}
            isInView={isInView}
            delay={0.4}
          />

          {/* Alliteration */}
          <DeviceSection
            title={content.alliteration.title}
            examples={content.alliteration.examples}
            isInView={isInView}
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
}

interface DeviceSectionProps {
  title: string;
  examples: Array<{ line: string; explanation: string }>;
  isInView: boolean;
  delay: number;
}

function DeviceSection({ title, examples, isInView, delay }: DeviceSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {examples.map((example, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-expanded={openIndex === index}
              aria-controls={`example-${index}`}
            >
              <span className="font-medium text-primary">
                {example.line}
              </span>
              <motion.svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`example-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                    {example.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentData } from '../types';
import StructureDiagram from './StructureDiagram';

interface StructureProps {
  content: ContentData['structure'];
}

export default function Structure({ content }: StructureProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredStanza, setHoveredStanza] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="py-20 px-4"
      aria-labelledby="structure-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="structure-heading"
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h2>

        <div className="mb-8 text-center text-lg">
          <p>
            <span className="font-semibold">Total Stanzas:</span>{' '}
            {/* TODO: Replace with actual stanza count */}
            {content.stanzaCount}
          </p>
        </div>

        {/* Structure diagram */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-8 overflow-x-auto">
            <div className="w-full flex justify-center min-h-[400px]">
              <StructureDiagram className="w-full h-auto max-w-full" />
            </div>
          </div>
        </motion.div>

        {/* Stanza breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          {content.stanzas.map((stanza, index) => (
            <motion.div
              key={index}
              className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-transparent hover:border-primary transition-colors"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              onMouseEnter={() => setHoveredStanza(index)}
              onMouseLeave={() => setHoveredStanza(null)}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {/* TODO: Replace with real stanza name */}
                {stanza.name}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Meter:</span>{' '}
                  {/* TODO: Replace with real meter information */}
                  {stanza.meter}
                </p>
                <p>
                  <span className="font-semibold">Syllable Count:</span>{' '}
                  {/* TODO: Replace with actual syllable count */}
                  {stanza.syllableCount}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  {/* TODO: Replace with real meter analysis */}
                  {stanza.description}
                </p>
              </div>

              {/* Highlight effect on hover */}
              {hoveredStanza === index && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-primary/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


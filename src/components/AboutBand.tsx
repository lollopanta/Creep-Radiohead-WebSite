import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentData } from '../types';

interface AboutBandProps {
  content: ContentData['band'];
}

export default function AboutBand({ content }: AboutBandProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
      aria-labelledby="about-band-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="about-band-heading"
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          About the Band
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image card with flip animation */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={isInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: -15 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src={content.image}
                alt="TODO: Replace with actual band name"
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image not found
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="40" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EPlaceholder Image%3C/text%3E%3C/svg%3E';
                }}
              />
              {/* Gloss overlay effect - using Pablo Honey colors */}
              <div className="absolute inset-0 bg-gradient-to-br from-pablo-cream/20 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold">
              {/* TODO: Replace with real band name */}
              {content.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {content.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


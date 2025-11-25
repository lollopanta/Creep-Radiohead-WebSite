import { motion } from 'framer-motion';
import { ContentData } from '../types';

interface FooterProps {
  content: ContentData['credits'];
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-16 px-4" aria-label="Credits and sources">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h2>

        <motion.p
          className="mb-8 text-gray-400 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* TODO: Replace with real credits and attribution */}
          {content.description}
        </motion.p>

        {content.sources.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Further Reading</h3>
            <ul className="space-y-2">
              {content.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    {/* TODO: Replace with real source titles and URLs */}
                    {source.title}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    {/* TODO: Replace with real source descriptions */}
                    {source.description}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            {/* TODO: Replace with real copyright information */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. TODO: Add copyright notice.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}


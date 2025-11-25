import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentData } from '../types';

interface LyricsExplorerProps {
  content: ContentData['lyrics'];
}

export default function LyricsExplorer({ content }: LyricsExplorerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedStanza, setSelectedStanza] = useState<number | null>(null);
  const stanzaRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToStanza = (index: number) => {
    setSelectedStanza(index);
    const element = stanzaRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;

      if (e.key === 'ArrowDown' && selectedStanza !== null) {
        e.preventDefault();
        const nextIndex = Math.min(selectedStanza + 1, content.stanzas.length - 1);
        scrollToStanza(nextIndex);
      } else if (e.key === 'ArrowUp' && selectedStanza !== null) {
        e.preventDefault();
        const nextIndex = Math.max(selectedStanza - 1, 0);
        scrollToStanza(nextIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStanza, content.stanzas.length]);

  return (
    <section
      ref={ref}
      className="py-20 px-4"
      aria-labelledby="lyrics-explorer-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="lyrics-explorer-heading"
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Stanza navigation */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <nav aria-label="Stanza navigation" className="sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Stanzas</h3>
              <ul className="space-y-2">
                {content.stanzas.map((stanza, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToStanza(index)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                        selectedStanza === index
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      aria-current={selectedStanza === index ? 'true' : undefined}
                      aria-label={`Navigate to ${stanza.name}`}
                    >
                      {/* TODO: Replace with real stanza names */}
                      {stanza.name}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                Use ↑ ↓ keys to navigate
              </p>
            </nav>
          </motion.div>

          {/* Lyrics content */}
          <motion.div
            className="md:col-span-3 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {content.stanzas.map((stanza, index) => (
              <motion.article
                key={index}
                ref={(el) => {
                  stanzaRefs.current[index] = el;
                }}
                id={`stanza-${index}`}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedStanza === index
                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                    : 'border-transparent bg-white dark:bg-gray-800 shadow-md hover:shadow-lg'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: selectedStanza === index ? 1.02 : 1,
                      }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                aria-labelledby={`stanza-${index}-heading`}
              >
                <h3
                  id={`stanza-${index}-heading`}
                  className="text-2xl font-semibold mb-4 text-primary"
                >
                  {/* TODO: Replace with real stanza names */}
                  {stanza.name}
                </h3>
                <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-serif leading-relaxed">
                  {stanza.content}
                </pre>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


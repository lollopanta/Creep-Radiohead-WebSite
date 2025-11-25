import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentData } from '../types';

interface AlbumProps {
  content: ContentData['album'];
}

export default function Album({ content }: AlbumProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="py-20 px-4"
      aria-labelledby="album-heading"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          id="album-heading"
          className="text-4xl md:text-5xl font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Album
        </motion.h2>

        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Vinyl record effect container */}
          <div className="relative group">
            {/* Album cover */}
            <motion.div
              className="relative w-64 md:w-80 mx-auto rounded-lg overflow-hidden shadow-2xl"
              whileHover={{ rotateY: 5, rotateX: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src={content.cover}
                alt={`TODO: ${content.name} album cover`}
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EAlbum Cover%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Gloss overlay that animates on hover - using Pablo Honey colors */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(242, 167, 4, 0.2), rgba(100, 132, 172, 0.1), transparent)',
                }}
              />
            </motion.div>

            {/* Rotating vinyl disc effect behind cover on hover */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-gray-900 dark:bg-black opacity-0 group-hover:opacity-30 transition-opacity"
              style={{
                width: '90%',
                height: '90%',
                left: '5%',
                top: '5%',
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Album metadata */}
          <motion.div
            className="mt-8 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold">
              {/* TODO: Replace with real album name */}
              {content.name}
            </h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-semibold">Year:</span>{' '}
                {/* TODO: Replace with real release year */}
                {content.year}
              </p>
              <p>
                <span className="font-semibold">Label:</span>{' '}
                {/* TODO: Replace with real record label */}
                {content.label}
              </p>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {content.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


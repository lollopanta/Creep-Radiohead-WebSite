import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ContentData } from '../types';

interface TimelineProps {
  content: ContentData['songHistory'];
}

export default function Timeline({ content }: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Check if section is in view for initial reveal
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  // Scroll-linked animations (only if motion is not reduced)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Only apply scroll animations if motion is not reduced
  const opacity = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0, 0.2, 0.8, 1],
    prefersReducedMotion ? [1, 1] : [0, 1, 1, 0]
  );
  
  const scale = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0, 0.2, 0.8, 1],
    prefersReducedMotion ? [1, 1] : [0.95, 1, 1, 0.95]
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800 relative"
      aria-labelledby="timeline-heading"
    >
      <motion.div
        ref={containerRef}
        style={{ 
          opacity: prefersReducedMotion ? undefined : opacity,
          scale: prefersReducedMotion ? undefined : scale,
        }}
        className="max-w-4xl mx-auto"
      >
        <motion.h2
          id="timeline-heading"
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: 'easeOut'
          }}
        >
          {content.title}
        </motion.h2>

        {/* Timeline line container */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div 
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pablo-yellow via-pablo-orange/70 to-pablo-blue transform md:-translate-x-1/2 z-0"
            style={{ transformOrigin: 'top center' }}
          />

          {/* Timeline items */}
          <div className="space-y-12 relative z-10">
            {content.timeline.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isSectionInView={isInView}
                delay={index * 0.1}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

interface TimelineItemProps {
  item: ContentData['songHistory']['timeline'][0];
  index: number;
  isSectionInView: boolean;
  delay: number;
  prefersReducedMotion: boolean;
}

function TimelineItem({ item, index, isSectionInView, delay, prefersReducedMotion }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const itemInView = useInView(itemRef, { once: true, amount: 0.3, margin: '0px 0px -100px 0px' });
  const isEven = index % 2 === 0;
  const shouldAnimate = isSectionInView && itemInView;

  return (
    <motion.div
      ref={itemRef}
      className="relative flex items-start md:items-center"
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        ease: 'easeOut'
      }}
      style={{ transformOrigin: 'center' }}
    >
      {/* Timeline dot */}
      <div 
        className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-gray-800 transform md:-translate-x-1/2 z-20 flex-shrink-0"
        style={{ top: '0.5rem' }}
      />

      {/* Content card */}
      <motion.div
        className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${
          isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto'
        }`}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: isEven ? -3 : 3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
          <div className={`flex ${isEven ? 'md:justify-end' : ''} items-center gap-2 mb-2`}>
            <span className="text-2xl font-bold text-primary">
              {/* TODO: Replace with real year */}
              {item.year}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {/* TODO: Replace with real timeline event title */}
            {item.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {/* TODO: Replace with real timeline event description */}
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

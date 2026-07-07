import { motion } from 'framer-motion';

export default function BlurText({
  text = "",
  className = "",
  delay = 0,
  stagger = 0.03,
  yOffset = 15,
  blurAmount = 4,
  duration = 0.4
}) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      filter: `blur(${blurAmount}px)`
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 120,
        duration: duration
      }
    }
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      aria-label={text}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em' }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-block"
          variants={childVariants}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

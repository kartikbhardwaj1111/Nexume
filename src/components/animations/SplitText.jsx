import { motion } from 'framer-motion';

export default function SplitText({
  text = "",
  className = "",
  delay = 0,
  stagger = 0.02,
  yOffset = 25,
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

  const wordVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger
      }
    }
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: yOffset
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 130,
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
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.2em' }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-flex"
          variants={wordVariants}
          aria-hidden="true"
          style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
        >
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              variants={childVariants}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.span>
  );
}

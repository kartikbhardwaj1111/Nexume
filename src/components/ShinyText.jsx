import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ShinyText = ({ 
  children, 
  className = '', 
  shimmerWidth = 100,
  speed = 3,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      className={`relative inline-block overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Shiny overlay */}
      <motion.div
        className="absolute inset-0 -top-2 -bottom-2"
        style={{
          background: `linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, 0.8) 50%,
            transparent 75%
          )`,
          width: `${shimmerWidth}%`,
          transform: 'skewX(-15deg)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1,
        }}
      />
    </motion.div>
  );
};

export default ShinyText;
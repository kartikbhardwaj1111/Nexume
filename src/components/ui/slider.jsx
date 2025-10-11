/**
 * Slider Component
 * A customizable range slider component
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

const Slider = React.forwardRef(({ 
  className, 
  value = [0], 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false,
  ...props 
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  const currentValue = value[0] || 0;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    if (onValueChange) {
      onValueChange([clampedValue]);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    let newValue = currentValue;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Track */}
      <div
        ref={sliderRef}
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Progress */}
        <div
          className="absolute h-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb */}
      <div
        ref={thumbRef}
        className={cn(
          'absolute block h-5 w-5 rounded-full border-2 border-blue-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isDragging && 'scale-110 shadow-lg',
          !disabled && 'cursor-grab active:cursor-grabbing hover:bg-blue-50'
        )}
        style={{ left: `calc(${percentage}% - 10px)` }}
        tabIndex={disabled ? -1 : 0}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
      />
    </div>
  );
});

Slider.displayName = 'Slider';

export { Slider };
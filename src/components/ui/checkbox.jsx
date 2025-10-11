/**
 * Checkbox Component
 * A customizable checkbox input component
 */

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ 
  className, 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  id,
  ...props 
}, ref) => {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      id={id}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'bg-white hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {checked && (
        <Check className="h-3 w-3" />
      )}
    </button>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
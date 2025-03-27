import React from 'react';
import { cn } from '../../lib/utils';

const CustomButton = React.forwardRef((
  { 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false,
    icon,
    iconPosition = 'left',
    disabled,
    ...props 
  }, ref) => {
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:opacity-90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizeStyles = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-5 py-2',
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          'overflow-hidden group',
          className,
          isLoading ? 'cursor-not-allowed opacity-70' : '',
          disabled ? 'cursor-not-allowed opacity-50' : ''
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        
        <span className={cn(
          'flex items-center gap-2',
          isLoading && 'opacity-0',
        )}>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </span>
        
        <span className="absolute inset-0 overflow-hidden rounded-md transform -z-10">
          <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 bg-black/5 origin-left transition-transform duration-500"></span>
        </span>
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;

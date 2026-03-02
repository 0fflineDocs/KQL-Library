import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button = ({ 
  className = "", 
  children, 
  ...props 
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-start rounded-lg text-sm font-medium transition-all duration-300 ease-out",
      "focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/70 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-0)]",
      "disabled:opacity-50 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;

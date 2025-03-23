import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ className = "", children, ...props }: CardProps) => (
  <div
    className={cn("rounded-md border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
);

export default Card;

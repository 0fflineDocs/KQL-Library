import React, { forwardRef } from 'react';
import { ReactNode } from 'react';
import { cn } from "@/lib/utils"

export interface CardProps {
    className?: string;
    children?: ReactNode;
}

export interface CardHeaderProps extends CardProps { }
export interface CardTitleProps extends CardProps { }
export interface CardDescriptionProps extends CardProps { }
export interface CardContentProps extends CardProps { }

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props}
    >
        {children}
    </div>
));
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
        {children}
    </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, children, ...props }, ref) => (
    <p
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    >
        {children}
    </p>
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, children, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    >
        {children}
    </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
        {children}
    </div>
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };

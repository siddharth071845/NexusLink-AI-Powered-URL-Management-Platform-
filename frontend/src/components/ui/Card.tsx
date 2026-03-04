import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hoverEffect = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-surface/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-300",
                    hoverEffect && "hover:-translate-y-1 hover:shadow-primary/10 hover:border-white/10 group",
                    className
                )}
                {...props}
            >
                {hoverEffect && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                )}
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
export { Card };

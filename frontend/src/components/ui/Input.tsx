import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-slate-300 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full h-14 bg-background/50 border border-white/10 rounded-xl text-text placeholder:text-muted/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-inner",
                            leftIcon ? "pl-12 pr-4" : "px-4",
                            error && "border-red-500 focus:ring-red-500/30 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-400 ml-1 animate-in fade-in slide-in-from-top-1 bg-red-500/10 inline-block px-2 py-0.5 rounded-md mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export { Input };

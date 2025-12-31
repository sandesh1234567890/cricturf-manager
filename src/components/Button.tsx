import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}) => {
    const variants = {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md',
        secondary: 'bg-yellow-500 text-emerald-900 hover:bg-yellow-600 shadow-md',
        outline: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50',
        ghost: 'text-emerald-600 hover:bg-emerald-50',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3 text-lg font-bold',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-semibold',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;

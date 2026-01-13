import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  fullWidth?: boolean;
}

export const Button = ({ children, className, variant = 'primary', fullWidth, ...props }: ButtonProps) => {
  const baseStyles = "flex items-center justify-center rounded-xl h-14 px-5 font-extrabold text-lg tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90",
    secondary: "bg-white dark:bg-white/5 text-[#181411] dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
  };
  
  return (
    <button 
      className={clsx(baseStyles, variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
};

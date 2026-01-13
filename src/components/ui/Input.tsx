import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <label className="flex flex-col min-w-40 flex-1">
      {label && <p className="text-[#181411] dark:text-white text-sm font-bold leading-normal pb-2">{label}</p>}
      <input 
        className={clsx(
          "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181411] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-[#e6dfdb] dark:border-white/20 bg-white dark:bg-white/5 focus:border-primary h-14 placeholder:text-[#8a7260] p-[15px] text-base font-normal transition-all",
          className
        )}
        {...props}
      />
    </label>
  );
};

"use client";
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopBar = ({ title, showBack = false, onBack }: TopBarProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/10">
      {showBack ? (
        <div 
            onClick={handleBack}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </div>
      ) : (
         <div className="text-primary flex size-12 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined text-3xl">restaurant</span>
         </div>
      )}
      
      <h2 className={`text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center ${showBack ? "pr-10" : "pr-12"}`}>
        {title}
      </h2>
    </div>
  );
};

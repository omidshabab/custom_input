import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     className?: string;
}

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
     return (
          <button
               className={cn(
                    'px-4 py-2 rounded-md font-medium transition-colors',
                    className
               )}
               {...props}
          >
               {children}
          </button>
     );
};

export { Button };
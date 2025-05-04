import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { detectLanguageAndApplyFont } from './languageDetector';
import { CustomInputProps } from './CustomInput.types';

const CustomInput: React.FC<CustomInputProps> = ({
     id,
     type = 'text',
     placeholder,
     label,
     disabled = false,
     value,
     onChange,
     className,
}) => {
     const [isFocused, setIsFocused] = useState(false);
     const [hasContent, setHasContent] = useState(false);
     const [error, setError] = useState(false);
     const inputRef = useRef<HTMLDivElement>(null);
     const containerRef = useRef<HTMLDivElement>(null);

     const validateInput = (text: string) => {
          if (type === 'email') {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               setError(!!(text.trim() && !emailRegex.test(text)));
          } else if (type === 'multiline') {
               setError(!text.trim());
          } else {
               setError(false);
          }
     };

     const handleInput = () => {
          if (inputRef.current) {
               const text = inputRef.current.textContent || '';
               setHasContent(text.trim() !== '');
               onChange?.(text);
               validateInput(text);
               if (type === 'multiline') {
                    autoResize();
               }
               detectLanguageAndApplyFont(inputRef.current);
          }
     };

     const autoResize = () => {
          if (containerRef.current && inputRef.current) {
               const lineHeight = parseInt(window.getComputedStyle(inputRef.current).lineHeight);
               const padding =
                    parseInt(window.getComputedStyle(containerRef.current).paddingTop) +
                    parseInt(window.getComputedStyle(containerRef.current).paddingBottom);
               const requiredHeight = Math.max(48, inputRef.current.scrollHeight + padding);
               containerRef.current.style.height = `${requiredHeight}px`;
          }
     };

     const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
          handleInput();
     };

     const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && type !== 'multiline') {
               e.preventDefault();
               validateInput(inputRef.current?.textContent || '');
               const nextInput = containerRef.current?.parentElement?.nextElementSibling?.querySelector(
                    '.input-text'
               );
               if (nextInput) {
                    (nextInput as HTMLDivElement).focus();
               }
          }
     };

     useEffect(() => {
          if (inputRef.current && value) {
               inputRef.current.textContent = value;
               handleInput();
          }
     }, [value]);

     return (
          <div className={cn('relative mb-5', className)}>
               <div
                    ref={containerRef}
                    className={cn(
                         'flex items-start w-full min-h-12 bg-background border-2 border-gray-200 rounded-lg p-3 text-base leading-6 box-border cursor-text transition-all outline-none text-foreground',
                         isFocused && 'border-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.2)]',
                         error && 'border-red-600',
                         disabled && 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed',
                         type === 'multiline' && 'h-auto'
                    )}
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => inputRef.current?.focus()}
               >
                    <div
                         ref={inputRef}
                         contentEditable={!disabled}
                         className={cn(
                              'input-text outline-none min-w-[1px] min-h-6 w-full break-words whitespace-pre-wrap',
                              disabled && 'cursor-not-allowed'
                         )}
                         data-placeholder={placeholder}
                         data-type={type}
                         onInput={handleInput}
                         onFocus={() => setIsFocused(true)}
                         onBlur={() => {
                              setIsFocused(false);
                              validateInput(inputRef.current?.textContent || '');
                         }}
                         onPaste={handlePaste}
                         onKeyDown={handleKeyDown}
                    />
               </div>
               <label
                    className={cn(
                         'absolute left-4 top-3.5 text-gray-500 text-base transition-all pointer-events-none',
                         (isFocused || hasContent) &&
                         'translate-y-[-24px] scale-[0.85] bg-background px-1 text-blue-600 -left-1',
                         error && 'text-red-600',
                         disabled && 'text-gray-400'
                    )}
               >
                    {label}
               </label>
               {error && (
                    <div className="text-red-600 text-sm mt-1">
                         {type === 'email' ? 'Please enter a valid email address' : 'Please provide a description'}
                    </div>
               )}
          </div>
     );
};

export default CustomInput;
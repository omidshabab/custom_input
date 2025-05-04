'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CustomInputProps } from './types';

export const CustomInput = ({
     id,
     label,
     placeholder,
     type = 'text',
     disabled = false,
     errorMessage,
     defaultValue = '',
     onChange,
     onBlur,
     allowNewLine = false
}: CustomInputProps) => {
     const [isFocused, setIsFocused] = useState(false);
     const [hasContent, setHasContent] = useState(!!defaultValue);
     const [isError, setIsError] = useState(false);
     const inputRef = useRef<HTMLDivElement>(null);

     // Initialize with default value if provided
     useEffect(() => {
          if (defaultValue && inputRef.current) {
               inputRef.current.textContent = defaultValue;
               setHasContent(true);
               detectLanguageAndApplyFont(inputRef.current);
          }
     }, [defaultValue]);

     const handleFocus = () => {
          if (!disabled) {
               setIsFocused(true);
               inputRef.current?.focus();
          }
     };

     const handleBlur = () => {
          setIsFocused(false);
          validateInput();
          if (onBlur && inputRef.current) {
               onBlur(inputRef.current.textContent || '');
          }
     };

     const handleInput = () => {
          if (!inputRef.current) return;

          const content = inputRef.current.textContent || '';
          setHasContent(content.trim() !== '');

          // Handle auto-resizing for multiline inputs
          if (type === 'multiline') {
               autoResizeInput();
          }

          // Detect language and apply appropriate font
          detectLanguageAndApplyFont(inputRef.current);

          // Trigger onChange if provided
          if (onChange) {
               onChange(content);
          }
     };

     const handleKeyDown = (e: React.KeyboardEvent) => {
          // Enter key for submit on single line inputs
          if (e.key === 'Enter' && type !== 'multiline') {
               if (allowNewLine) {
                    // Allow new line if allowNewLine is true
                    document.execCommand('insertLineBreak');
                    e.preventDefault();
               } else {
                    e.preventDefault();
                    validateInput();
                    // Move to next input or submit form logic would go here
               }
          }
     };

     const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');

          // Insert text at cursor position
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0 && inputRef.current) {
               const range = selection.getRangeAt(0);
               range.deleteContents();

               const textNode = document.createTextNode(text);
               range.insertNode(textNode);

               // Move cursor to end of inserted text
               range.setStartAfter(textNode);
               range.collapse(true);
               selection.removeAllRanges();
               selection.addRange(range);

               // Process text with language detection
               detectLanguageAndApplyFont(inputRef.current);

               // Trigger input event
               handleInput();
          }
     };

     // Language detection and font application
     const detectLanguageAndApplyFont = (element: HTMLElement) => {
          const text = element.textContent || '';

          // If empty, reset styles
          if (!text.trim()) {
               element.innerHTML = '';
               element.className = 'outline-none min-w-[1px] min-h-6 w-full break-words whitespace-pre-wrap';
               element.style.direction = 'ltr';
               return;
          }

          // Check for Persian/Arabic characters
          const persianArabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

          // Check for English/Latin characters
          const latinRegex = /[A-Za-z]/;

          // Process text character by character
          let processedHTML = '';
          for (let i = 0; i < text.length; i++) {
               const char = text[i];

               if (persianArabicRegex.test(char)) {
                    // Persian/Arabic character
                    processedHTML += `<span class="font-fa">${char}</span>`;
               } else if (latinRegex.test(char)) {
                    // Latin character
                    processedHTML += `<span class="font-en">${char}</span>`;
               } else {
                    // Other characters (numbers, symbols, etc.)
                    if (i > 0) {
                         const prevChar = text[i - 1];
                         if (persianArabicRegex.test(prevChar)) {
                              processedHTML += `<span class="font-estedad">${char}</span>`;
                         } else {
                              processedHTML += `<span class="font-manrope">${char}</span>`;
                         }
                    } else {
                         // Default for first character if it's not alpha
                         processedHTML += `<span class="font-manrope">${char}</span>`;
                    }
               }
          }

          // Determine predominant direction for overall text alignment
          const persianArabicCount = (text.match(persianArabicRegex) || []).length;
          const latinCount = (text.match(latinRegex) || []).length;
          element.style.direction = persianArabicCount > latinCount ? 'rtl' : 'ltr';

          // Preserve the input-text class
          element.className = 'outline-none min-w-[1px] min-h-6 w-full break-words whitespace-pre-wrap';

          // Save caret position
          const selection = window.getSelection();
          const caretPosition = getCaretPosition(element);
          const isSelectionInElement = selection && selection.rangeCount > 0 &&
               element.contains(selection.anchorNode);

          // Update HTML content
          element.innerHTML = processedHTML;

          // Restore caret position
          if (isSelectionInElement) {
               restoreCaretPosition(element, caretPosition);
          }
     };

     // Helper function to get caret position
     const getCaretPosition = (element: HTMLElement): number => {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return 0;

          const range = selection.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          return preCaretRange.toString().length;
     };

     // Helper function to restore caret position
     const restoreCaretPosition = (element: HTMLElement, position: number) => {
          // Traverse the element's text nodes to find the right position
          const textNodes: Node[] = [];
          const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
          let node: Node | null;

          while (node = walk.nextNode()) {
               textNodes.push(node);
          }

          let charCount = 0;
          let foundNode: Node | null = null;
          let foundOffset = 0;

          for (let i = 0; i < textNodes.length; i++) {
               const node = textNodes[i];
               const nodeLength = node.textContent?.length || 0;

               if (charCount + nodeLength >= position) {
                    foundNode = node;
                    foundOffset = position - charCount;
                    break;
               }

               charCount += nodeLength;
          }

          if (foundNode) {
               const range = document.createRange();
               range.setStart(foundNode, foundOffset);
               range.collapse(true);

               const selection = window.getSelection();
               if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
               }
          }
     };

     // Validation function
     const validateInput = () => {
          if (!inputRef.current) return;

          const content = inputRef.current.textContent || '';

          if (type === 'email') {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               setIsError(!!content && !emailRegex.test(content));
          } else if (type === 'multiline') {
               setIsError(!content.trim());
          } else {
               setIsError(false);
          }
     };

     // Auto-resize function for multiline inputs
     const autoResizeInput = () => {
          if (!inputRef.current) return;

          const containerEl = inputRef.current.parentElement;
          if (!containerEl) return;

          // Update container min-height based on content
          const requiredHeight = Math.max(
               48, // minimum height
               inputRef.current.scrollHeight + 24 // add padding
          );

          containerEl.style.minHeight = `${requiredHeight}px`;
     };

     return (
          <div className="relative mb-5">
               <div
                    className={`
          w-full min-h-12 bg-white border-2 rounded-lg px-4 py-3 text-base 
          cursor-text transition-all flex items-start
          ${isFocused ? 'border-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.2)]' : 'border-gray-200'}
          ${hasContent || isFocused ? 'has-content' : ''}
          ${isError ? 'border-red-600' : ''}
          ${disabled ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : ''}
        `}
                    onClick={handleFocus}
                    tabIndex={disabled ? -1 : 0}
               >
                    <div
                         ref={inputRef}
                         className="outline-none min-w-[1px] min-h-6 w-full break-words whitespace-pre-wrap"
                         contentEditable={!disabled}
                         suppressContentEditableWarning={true}
                         onFocus={() => setIsFocused(true)}
                         onBlur={handleBlur}
                         onInput={handleInput}
                         onKeyDown={handleKeyDown}
                         onPaste={handlePaste}
                         data-placeholder={placeholder}
                         data-type={type}
                    />
               </div>
               <label
                    className={`
          absolute left-4 top-3.5 text-gray-500 pointer-events-none transition-all
          ${hasContent || isFocused
                              ? 'transform -translate-y-6 scale-90 bg-white px-1 left-3'
                              : ''
                         }
          ${isFocused ? 'text-blue-600' : ''}
          ${isError ? 'text-red-600' : ''}
          ${disabled ? 'text-gray-400' : ''}
        `}
               >
                    {label}
               </label>
               {isError && errorMessage && (
                    <div className="text-red-600 text-sm mt-1">
                         {errorMessage}
                    </div>
               )}
          </div>
     );
};

export default CustomInput;
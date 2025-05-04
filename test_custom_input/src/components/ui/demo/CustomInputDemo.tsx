import React, { useState } from 'react';
import CustomInput from '../custom-input/CustomInput';
import { Button } from '../button';

const CustomInputDemo: React.FC = () => {
     const [email, setEmail] = useState('');
     const [description, setDescription] = useState('');

     const handleSubmit = () => {
          if (email && description) {
               console.log('Form submitted:', { email, description });
               alert(`Form submitted successfully!\n\nEmail: ${email}\nDescription: ${description}`);
          }
     };

     const addSampleText = (type: 'english' | 'persian' | 'mixed') => {
          if (type === 'english') {
               setDescription(
                    'This is a sample English text to demonstrate automatic font switching. The system will detect Latin characters and apply the appropriate font style.'
               );
          } else if (type === 'persian') {
               setDescription(
                    'این یک متن نمونه فارسی است برای نمایش تشخیص خودکار زبان و تغییر فونت. سیستم کاراکترهای فارسی را تشخیص داده و فونت مناسب را اعمال می کند.'
               );
          } else {
               setDescription(
                    'این یک متن ترکیبی با English words است که هم شامل کلمات فارسی و هم انگلیسی می‌باشد. The system will detect the predominant script and set direction accordingly.'
               );
          }
     };

     return (
          <div className="w-full max-w-md p-6 rounded-xl bg-background shadow-lg">
               <h2 className="text-2xl font-semibold text-foreground mb-6">Custom Text Input Demo</h2>
               <CustomInput
                    id="email-input"
                    type="email"
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChange={setEmail}
               />
               <CustomInput
                    id="description-input"
                    type="multiline"
                    label="Description"
                    placeholder="Description"
                    value={description}
                    onChange={setDescription}
               />
               <CustomInput
                    id="disabled-input"
                    type="text"
                    label="Disabled Input"
                    placeholder="Disabled"
                    disabled
               />
               <Button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
               >
                    Submit
               </Button>
               <div className="flex gap-2 mt-5 justify-center">
                    <Button
                         onClick={() => addSampleText('english')}
                         className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                         Add English Text
                    </Button>
                    <Button
                         onClick={() => addSampleText('persian')}
                         className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                         Add Persian Text
                    </Button>
                    <Button
                         onClick={() => addSampleText('mixed')}
                         className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                         Add Mixed Text
                    </Button>
               </div>
          </div>
     );
};

export default CustomInputDemo;
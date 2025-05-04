// app/page.tsx
'use client';

import { useState } from 'react';
import { CustomInput } from '@/components/ui/custom-input/input';

export default function Home() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = () => {
    // Validation is handled by the component itself
    // This is just additional submission logic
    console.log({ email, description });
    setSubmitSuccess(true);

    // Reset form after showing success message
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Custom Input Demo</h2>

          <CustomInput
            id="email-input"
            label="Email"
            type="email"
            allowNewLine={true}
            errorMessage="Please enter a valid email address"
            onChange={setEmail}
          />

          <CustomInput
            id="description-input"
            label="Description"
            type="multiline"
            allowNewLine={true}
            errorMessage="Please provide a description"
            onChange={setDescription}
          />

          <CustomInput
            id="disabled-input"
            label="Disabled Input"
            disabled={true}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 px-5 text-base cursor-pointer transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {submitSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              Form submitted successfully!
              <br />
              Email: {email}
              <br />
              Description: {description}
            </div>
          )}
        </div>

        {/* Demo Buttons for Language Testing */}
        <div className="mt-5 flex gap-3 justify-center">
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-md py-2 px-4 text-sm"
            onClick={() => setDescription("This is a sample English text to demonstrate automatic font switching. The system will detect Latin characters and apply the appropriate font style.")}
          >
            Add English Text
          </button>

          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-md py-2 px-4 text-sm"
            onClick={() => setDescription("این یک متن نمونه فارسی است برای نمایش تشخیص خودکار زبان و تغییر فونت. سیستم کاراکترهای فارسی را تشخیص داده و فونت مناسب را اعمال می کند.")}
          >
            Add Persian Text
          </button>

          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-md py-2 px-4 text-sm"
            onClick={() => setDescription("این یک متن ترکیبی با English words است که هم شامل کلمات فارسی و هم انگلیسی می‌باشد. The system will detect the predominant script and set direction accordingly.")}
          >
            Add Mixed Text
          </button>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [test, setTest] = useState('Hello World');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Debug Page
        </h1>
        <p className="text-gray-600 mb-4">
          {test}
        </p>
        <button
          onClick={() => setTest('Button clicked!')}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

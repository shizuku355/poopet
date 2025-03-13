"use client";

import { useState } from 'react';

interface NameInputModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  language: string;
}

const NameInputModal = ({ isOpen, onSubmit, language }: NameInputModalProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length === 0) {
      setError(language === 'ja' ? '名前を入力してください' : 'Please enter a name');
      return;
    }
    
    if (name.length > 20) {
      setError(language === 'ja' ? '名前は20文字以内にしてください' : 'Name must be 20 characters or less');
      return;
    }
    
    onSubmit(name.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 max-w-[90%]">
        <h2 className="text-xl font-bold text-amber-900 mb-4">
          {language === 'ja' ? 'ポウペットに名前をつけてください' : 'Name your Poopet'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder={language === 'ja' ? 'ポウペットの名前' : 'Poopet name'}
            maxLength={20}
          />
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {language === 'ja' ? '決定' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal; 
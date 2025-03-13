"use client";

import { useState } from 'react';

interface GachaScreenProps {
  isAnimating: boolean;
  onStartGacha: () => void;
  language: string;
}

const GachaScreen = ({ isAnimating, onStartGacha, language }: GachaScreenProps) => {
  return (
    <div className="text-center p-6 bg-amber-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-800">
        {language === 'ja' ? 'うんちガチャ' : 'Poop Gacha'}
      </h2>
      <div className="mb-6">
        {isAnimating ? (
          <div className="w-64 h-64 mx-auto relative">
            {/* 犬のおしりからうんちが生まれる演出（仮の実装） */}
            <div className="w-32 h-32 mx-auto bg-amber-300 rounded-full relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
                <span className="text-6xl">💩</span>
              </div>
            </div>
            <div className="mt-4 text-center text-lg animate-pulse">
              {language === 'ja' 
                ? '新しいポウペットが生まれています...'
                : 'A new Poopet is being born...'}
            </div>
          </div>
        ) : (
          <button 
            onClick={onStartGacha}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
          >
            {language === 'ja' ? 'ガチャを引く' : 'Pull Gacha'}
          </button>
        )}
      </div>
      <p className="text-sm text-amber-700">
        {language === 'ja' 
          ? 'ノーマル１ (40%), ノーマル２ (40%), レア (20%)'
          : 'Normal１ (40%), Normal２ (40%), Rare (20%)'}
      </p>
    </div>
  );
};

export default GachaScreen; 
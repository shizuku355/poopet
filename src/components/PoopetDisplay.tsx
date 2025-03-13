"use client";

import { PoopetCharacter } from '../types';

interface PoopetDisplayProps {
  appearance: string;
  level: number;
  type: string;
  isDead: boolean;
  isEvolving: boolean;
  name: string;
  language: string;
}

const PoopetDisplay = ({ 
  appearance, 
  level, 
  type, 
  isDead, 
  isEvolving,
  name,
  language
}: PoopetDisplayProps) => {
  // タイプに応じた背景色とサイズ
  const getBgColor = () => {
    if (isDead) return 'bg-gray-200';
    
    switch (type) {
      case 'normal':
        return 'bg-amber-100';
      case 'rare':
        return 'bg-amber-200';
      case 'superRare':
        return 'bg-amber-300';
      default:
        return 'bg-amber-100';
    }
  };
  
  const getSize = () => {
    if (level >= 50) return 'w-40 h-40 text-7xl';
    if (level >= 20) return 'w-36 h-36 text-6xl';
    if (level >= 10) return 'w-32 h-32 text-5xl';
    return 'w-28 h-28 text-4xl';
  };
  
  return (
    <div className="text-center mb-6">
      <div className="text-6xl mb-2 transition-transform duration-300" style={{
        transform: isEvolving ? 'scale(1.2)' : 'scale(1)',
        filter: isEvolving ? 'brightness(1.5)' : 'none'
      }}>
        <img src={appearance} alt={name} className="w-full h-full object-contain" />
      </div>
      <h2 className="text-xl font-bold text-amber-900 mb-1">
        {name}
      </h2>
      <p className="text-sm text-amber-700">
        {language === 'ja' ? 'レベル' : 'Level'} {level} 
        {' • '}
        {language === 'ja' ? 
          (type === 'normal' ? 'ノーマル' : type === 'rare' ? 'レア' : 'スーパーレア') :
          (type === 'normal' ? 'Normal' : type === 'rare' ? 'Rare' : 'Super Rare')
        }
      </p>
    </div>
  );
};

export default PoopetDisplay; 
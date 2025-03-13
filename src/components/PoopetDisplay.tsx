"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  // 演出用の状態
  const [showEvolutionText, setShowEvolutionText] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // クライアントサイドでのマウント検出
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 進化演出の制御
  useEffect(() => {
    if (!isMounted) return;
    
    if (isEvolving) {
      // 進化テキストを表示
      setShowEvolutionText(true);
      
      // キラキラエフェクトを表示
      setShowSparkles(true);
      
      // 一定時間後に演出を終了
      const timer = setTimeout(() => {
        setShowEvolutionText(false);
        setShowSparkles(false);
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        setShowEvolutionText(false);
        setShowSparkles(false);
      };
    }
  }, [isEvolving, isMounted]);
  
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
  
  // キラキラエフェクト用の星を生成
  const renderSparkles = () => {
    if (!showSparkles) return null;
    
    // ランダム値をクライアント側でのみ生成するように修正
    const sparklePositions = [
      { top: '10%', left: '20%', delay: '0.1s' },
      { top: '30%', left: '80%', delay: '0.2s' },
      { top: '50%', left: '10%', delay: '0.3s' },
      { top: '70%', left: '50%', delay: '0.2s' },
      { top: '90%', left: '30%', delay: '0.1s' },
      { top: '20%', left: '60%', delay: '0.3s' },
      { top: '60%', left: '70%', delay: '0.4s' },
      { top: '80%', left: '40%', delay: '0.2s' }
    ];
    
    return sparklePositions.map((pos, index) => (
      <div 
        key={index} 
        className="absolute evolution-sparkle" 
        style={{
          width: '20px',
          height: '20px',
          background: 'radial-gradient(circle, #FFD700, transparent)',
          borderRadius: '50%',
          top: pos.top,
          left: pos.left,
          animationDelay: pos.delay
        }}
      />
    ));
  };
  
  return (
    <div className="text-center mb-6 relative">
      {/* 進化テキスト - クライアントサイドでのみ表示 */}
      {isMounted && showEvolutionText && (
        <div className="absolute top-0 left-0 right-0 z-10 evolution-text">
          {language === 'ja' ? '進化！' : 'Evolution!'}
        </div>
      )}
      
      <div className={`${getBgColor()} ${getSize()} rounded-full flex items-center justify-center relative ${isMounted && isEvolving ? 'animate-pulse' : isMounted ? 'poopet-bounce' : ''}`} style={{
        transform: isMounted && isEvolving ? 'scale(1.2)' : 'scale(1)',
        filter: isMounted && isEvolving ? 'brightness(1.5)' : 'none'
      }}>
        {/* キラキラエフェクト - クライアントサイドでのみ表示 */}
        {isMounted && renderSparkles()}
        
        {/* 進化時の回転アニメーション - クライアントサイドでのみ適用 */}
        <Image 
          src={appearance} 
          alt={name} 
          className={`absolute w-full h-full object-contain ${isMounted && isEvolving ? 'evolution-rotate' : ''}`}
          width={150}
          height={150}
        />
        
        {isMounted && isEvolving && (
          <div className="absolute inset-0 bg-yellow-400 bg-opacity-30 rounded-full animate-ping"></div>
        )}
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
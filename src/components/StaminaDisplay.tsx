"use client";

import { useState, useEffect } from 'react';
import { STAMINA_CONFIG } from '../types';

interface StaminaDisplayProps {
  stamina: number;
  maxStamina: number;
  staminaTokens: number;
  lastStaminaRecovery: string;
  onUseToken: () => void;
  onOpenShop: () => void;
  language: string;
}

const StaminaDisplay = ({
  stamina,
  maxStamina,
  staminaTokens,
  lastStaminaRecovery,
  onUseToken,
  onOpenShop,
  language
}: StaminaDisplayProps) => {
  const [nextRecoveryTime, setNextRecoveryTime] = useState<string>('');

  useEffect(() => {
    const updateRecoveryTime = () => {
      if (stamina >= maxStamina) {
        setNextRecoveryTime(language === 'ja' ? 'スタミナ満タン' : 'Stamina Full');
        return;
      }

      const now = new Date();
      const lastRecovery = new Date(lastStaminaRecovery);
      const nextRecovery = new Date(lastRecovery.getTime() + STAMINA_CONFIG.RECOVERY_INTERVAL);
      const timeDiff = nextRecovery.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setNextRecoveryTime(language === 'ja' ? '回復中...' : 'Recovering...');
        return;
      }

      const minutes = Math.floor(timeDiff / (1000 * 60));
      setNextRecoveryTime(
        language === 'ja' 
          ? `${minutes}分後に回復` 
          : `Recovers in ${minutes} min`
      );
    };

    updateRecoveryTime();
    const interval = setInterval(updateRecoveryTime, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [stamina, maxStamina, lastStaminaRecovery, language]);

  return (
    <div className="flex items-center justify-between bg-amber-50 rounded-xl p-4 mb-4">
      <div>
        <p className="text-amber-900 font-bold">
          {language === 'ja' ? 'スタミナ' : 'Stamina'}
        </p>
        <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${(stamina / maxStamina) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-amber-700">
            {stamina} / {maxStamina}
          </p>
          <p className="text-xs text-amber-600 ml-2">
            {nextRecoveryTime}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={onUseToken}
          disabled={staminaTokens <= 0}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg mr-2 transition-colors"
        >
          {language === 'ja' ? '回復する' : 'Recover'} ({staminaTokens})
        </button>
        <button
          onClick={onOpenShop}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {language === 'ja' ? '購入' : 'Shop'}
        </button>
      </div>
    </div>
  );
};

export default StaminaDisplay; 
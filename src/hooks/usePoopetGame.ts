"use client";

import { useState, useEffect } from 'react';
import { PoopetCharacter, PoopetType, STAMINA_CONFIG } from '../types';

// 一時的な画像パスの代わりに絵文字を使用
const POOPET_EMOJIS = {
  normal: {
    level1: '💩',
    level10: '💩',
    level20: '💩',
    level50: '💩',
  },
  rare: {
    level1: '💩',
    level10: '💩',
    level20: '💩',
    level50: '💩',
    level50Special: '👑💩'
  },
  superRare: {
    level1: '💩',
    level10: '✨💩',
    level20: '✨💩✨',
    level50: '🌟💩🌟',
    level50Special: '👑✨💩✨👑'
  }
};

export const usePoopetGame = () => {
  const [poopet, setPoopet] = useState<PoopetCharacter | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isGachaAnimating, setIsGachaAnimating] = useState(false);
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isNameInputOpen, setIsNameInputOpen] = useState(false);
  const [stamina, setStamina] = useState<number>(STAMINA_CONFIG.MAX_STAMINA);
  const [maxStamina] = useState<number>(STAMINA_CONFIG.MAX_STAMINA);
  const [staminaTokens, setStaminaTokens] = useState<number>(3);
  const [lastStaminaRecovery, setLastStaminaRecovery] = useState<string>(new Date().toISOString());
  
  // ゲームの初期化
  useEffect(() => {
    const savedPoopet = localStorage.getItem('poopet');
    if (savedPoopet) {
      const parsedPoopet = JSON.parse(savedPoopet);
      setPoopet(parsedPoopet);
      setGameStarted(true);
      
      // 時間経過による状態変化をチェック
      checkPoopetStatus(parsedPoopet);
    }
  }, []);
  
  // 時間経過による自動ステータス更新（1分ごと）
  useEffect(() => {
    if (!poopet || poopet.isDead) return;
    
    const interval = setInterval(() => {
      updatePoopetStats();
    }, 60000); // 1分ごとに更新
    
    return () => clearInterval(interval);
  }, [poopet]);
  
  // ポウペットの状態をチェック（24時間ケアしなかった場合など）
  const checkPoopetStatus = (pet: PoopetCharacter) => {
    const now = new Date();
    const lastFed = new Date(pet.lastFed);
    const lastCleaned = new Date(pet.lastCleaned);
    
    const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
    const hoursSinceLastCleaned = (now.getTime() - lastCleaned.getTime()) / (1000 * 60 * 60);
    
    // 24時間以上ケアしていなかったら死亡
    if (hoursSinceLastFed > 24 || hoursSinceLastCleaned > 24) {
      pet.isDead = true;
      setPoopet({...pet});
      localStorage.setItem('poopet', JSON.stringify(pet));
    }
  };
  
  // ガチャを開始
  const startGacha = () => {
    setGameStarted(true);
    setIsGachaOpen(true);
  };
  
  // ガチャを引く
  const pullGacha = () => {
    setIsGachaAnimating(true);
    
    // 3秒後に結果表示
    setTimeout(() => {
      generateNewPoopet();
      setIsGachaAnimating(false);
      setIsGachaOpen(false);
    }, 3000);
  };
  
  // 新しいポウペットを生成
  const generateNewPoopet = () => {
    // ガチャの確率設定：ノーマル(70%)、レア(25%)、スーパーレア(5%)
    const random = Math.random();
    let type: PoopetType = 'normal';
    
    if (random < 0.05) {
      type = 'superRare';
    } else if (random < 0.30) {
      type = 'rare';
    }
    
    const now = new Date().toISOString();
    const newPoopet: PoopetCharacter = {
      id: Math.random().toString(36).substring(2),
      name: '',  // 名前は後で設定
      type: type,
      level: 1,
      evolutionStages: {
        level1: POOPET_EMOJIS[type].level1,
        level10: POOPET_EMOJIS[type].level10,
        level20: POOPET_EMOJIS[type].level20,
        level50: POOPET_EMOJIS[type].level50,
        level50Special: type !== 'normal' ? POOPET_EMOJIS[type].level50Special : undefined
      },
      stats: {
        hunger: 50,
        happiness: 50,
        cleanliness: 50,
        love: 0,
        stamina: STAMINA_CONFIG.MAX_STAMINA,
        maxStamina: STAMINA_CONFIG.MAX_STAMINA,
        staminaTokens: 3
      },
      lastFed: now,
      lastCleaned: now,
      lastActionTime: now,
      lastStaminaRecovery: now,
      birthDate: now,
      isDead: false
    };
    
    setPoopet(newPoopet);
    setIsNameInputOpen(true);  // 名前入力モーダルを表示
  };
  
  // 名前を設定
  const setPoopetName = (name: string) => {
    if (!poopet) return;
    
    const namedPoopet = {
      ...poopet,
      name
    };
    
    setPoopet(namedPoopet);
    setIsNameInputOpen(false);
    setGameStarted(true);
    
    // LocalStorageに保存
    localStorage.setItem('poopet', JSON.stringify(namedPoopet));
  };
  
  // スタミナの自動回復チェック
  const checkStaminaRecovery = () => {
    if (!poopet || poopet.isDead) return;

    const now = new Date();
    const lastRecovery = new Date(poopet.lastStaminaRecovery);
    const timeDiff = now.getTime() - lastRecovery.getTime();
    
    // 10時間経過ごとにスタミナを1回復
    const recoveryCount = Math.floor(timeDiff / STAMINA_CONFIG.RECOVERY_INTERVAL);
    
    if (recoveryCount > 0 && stamina < maxStamina) {
      const newStamina = Math.min(
        maxStamina,
        stamina + (recoveryCount * STAMINA_CONFIG.RECOVERY_RATE)
      );
      
      const newPoopet = {
        ...poopet,
        stats: {
          ...poopet.stats,
          stamina: newStamina
        },
        lastStaminaRecovery: now.toISOString()
      };
      
      setPoopet(newPoopet);
      localStorage.setItem('poopet', JSON.stringify(newPoopet));
    }
  };

  // スタミナの自動回復チェックを定期的に実行
  useEffect(() => {
    if (!poopet || poopet.isDead) return;
    
    const interval = setInterval(() => {
      checkStaminaRecovery();
    }, 60000); // 1分ごとにチェック
    
    return () => clearInterval(interval);
  }, [poopet]);

  // 初期ロード時にもスタミナ回復をチェック
  useEffect(() => {
    if (poopet) {
      checkStaminaRecovery();
    }
  }, []);

  // アクション実行時のスタミナチェック
  const canPerformAction = (actionType: keyof typeof STAMINA_CONFIG.ACTION_COSTS): boolean => {
    if (!poopet || poopet.isDead) return false;
    
    // スタミナが足りるかチェック
    return stamina >= STAMINA_CONFIG.ACTION_COSTS[actionType];
  };

  // スタミナを消費
  const useStamina = (actionType: keyof typeof STAMINA_CONFIG.ACTION_COSTS) => {
    if (!poopet) return;
    
    const newStamina = Math.max(0, stamina - STAMINA_CONFIG.ACTION_COSTS[actionType]);
    const now = new Date().toISOString();
    
    setStamina(newStamina);
    setLastStaminaRecovery(now);
    
    const newPoopet = {
      ...poopet,
      lastActionTime: now
    };
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
  };

  const useStaminaToken = () => {
    if (!poopet || staminaTokens <= 0) return;
    
    const newStamina = Math.min(
      maxStamina,
      stamina + STAMINA_CONFIG.RECOVERY_ITEM
    );
    
    setStamina(newStamina);
    setStaminaTokens(prev => prev - 1);
    setLastStaminaRecovery(new Date().toISOString());
    
    const newPoopet = {
      ...poopet,
      stats: {
        ...poopet.stats,
        stamina: newStamina,
        staminaTokens: staminaTokens - 1
      },
      lastStaminaRecovery: new Date().toISOString()
    };
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
  };

  const purchaseStaminaTokens = (amount: number) => {
    if (!poopet) return;
    
    // TODO: ブロックチェーン連携後に実装
    const newPoopet = {
      ...poopet,
      stats: {
        ...poopet.stats,
        staminaTokens: Math.min(
          STAMINA_CONFIG.MAX_TOKENS,
          staminaTokens + amount
        )
      }
    };
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
  };
  
  // 餌やり
  const feedPoopet = () => {
    if (!canPerformAction('feed')) return;
    
    if (!poopet || poopet.isDead) return;
    
    useStamina('feed');
    
    const newHunger = Math.min(100, poopet.stats.hunger + 20);
    const newHappiness = Math.min(100, poopet.stats.happiness + 5);
    
    // 状態更新
    const newPoopet = {
      ...poopet,
      stats: {
        ...poopet.stats,
        hunger: newHunger,
        happiness: newHappiness,
        love: Math.min(100, poopet.stats.love + 2), // 愛情も少し増加
      },
      lastFed: new Date().toISOString()
    };
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
    
    // 経験値獲得でレベルアップの可能性
    const shouldLevelUp = Math.random() > 0.7; // 30%の確率でレベルアップ
    if (shouldLevelUp) {
      levelUp();
    }
  };
  
  // 遊ぶ
  const playWithPoopet = () => {
    if (!canPerformAction('play')) return;
    
    if (!poopet || poopet.isDead) return;
    
    useStamina('play');
    
    const newHappiness = Math.min(100, poopet.stats.happiness + 20);
    const newHunger = Math.max(0, poopet.stats.hunger - 5); // 遊ぶとお腹が減る
    
    // 状態更新
    const newPoopet = {
      ...poopet,
      stats: {
        ...poopet.stats,
        happiness: newHappiness,
        hunger: newHunger,
        love: Math.min(100, poopet.stats.love + 3), // 愛情も増加
      }
    };
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
    
    // 経験値獲得でレベルアップの可能性
    const shouldLevelUp = Math.random() > 0.7; // 30%の確率でレベルアップ
    if (shouldLevelUp) {
      levelUp();
    }
  };
  
  // 掃除
  const cleanPoopet = () => {
    if (!canPerformAction('clean')) return;
    
    if (!poopet || poopet.isDead) return;
    
    useStamina('clean');
    
    const newCleanliness = Math.min(100, poopet.stats.cleanliness + 20);
    
    // 状態更新
    const newPoopet = {
      ...poopet,
      stats: {
        ...poopet.stats,
        cleanliness: newCleanliness,
        love: Math.min(100, poopet.stats.love + 1), // 愛情も少し増加
      },
      lastCleaned: new Date().toISOString()
    };
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
    
    // 経験値獲得でレベルアップの可能性
    const shouldLevelUp = Math.random() > 0.7; // 30%の確率でレベルアップ
    if (shouldLevelUp) {
      levelUp();
    }
  };
  
  // レベルアップ
  const levelUp = () => {
    if (!poopet || poopet.isDead) return;
    
    const newLevel = poopet.level + 1;
    const newPoopet = {...poopet, level: newLevel};
    
    // 進化の条件チェック
    if ((newLevel === 10 || newLevel === 20 || newLevel === 50) && 
        (newLevel === 50 && poopet.stats.love >= 90 && poopet.type !== 'normal')) {
      // 愛情MAXでの特殊進化（レベル50かつ愛情90以上）
      setShowEvolutionAnimation(true);
      
      // 2秒後にアニメーション終了
      setTimeout(() => {
        setShowEvolutionAnimation(false);
      }, 2000);
    }
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
  };
  
  // 時間経過によるステータス自動更新
  const updatePoopetStats = () => {
    if (!poopet || poopet.isDead) return;
    
    // 時間経過でステータスが下がる
    const newHunger = Math.max(0, poopet.stats.hunger - 2);
    const newHappiness = Math.max(0, poopet.stats.happiness - 1);
    const newCleanliness = Math.max(0, poopet.stats.cleanliness - 3);
    
    // 状態更新
    const newPoopet = {
      ...poopet,
      stats: {
        ...poopet.stats,
        hunger: newHunger,
        happiness: newHappiness,
        cleanliness: newCleanliness
      }
    };
    
    // ステータスが0になると死亡リスクが高まる
    if (newHunger === 0 || newCleanliness === 0) {
      const deathRisk = Math.random();
      if (deathRisk > 0.7) { // 30%の確率で死亡
        newPoopet.isDead = true;
      }
    }
    
    setPoopet(newPoopet);
    localStorage.setItem('poopet', JSON.stringify(newPoopet));
  };
  
  // ポウペットの現在の進化段階に応じた表示を取得
  const getCurrentAppearance = () => {
    if (!poopet) return '💩'; // デフォルト
    
    if (poopet.isDead) return '👻'; // 死亡時
    
    if (poopet.level >= 50 && poopet.stats.love >= 90 && poopet.type !== 'normal') {
      return poopet.evolutionStages.level50Special || poopet.evolutionStages.level50;
    } else if (poopet.level >= 50) {
      return poopet.evolutionStages.level50;
    } else if (poopet.level >= 20) {
      return poopet.evolutionStages.level20;
    } else if (poopet.level >= 10) {
      return poopet.evolutionStages.level10;
    } else {
      return poopet.evolutionStages.level1;
    }
  };
  
  // ゲームリセット（デバッグ用）
  const resetGame = () => {
    localStorage.removeItem('poopet');
    setPoopet(null);
    setGameStarted(false);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (stamina < maxStamina) {
        setStamina(prev => Math.min(prev + 1, maxStamina));
        setLastStaminaRecovery(new Date().toISOString());
      }
    }, STAMINA_CONFIG.RECOVERY_INTERVAL);

    return () => clearInterval(interval);
  }, [stamina, maxStamina]);
  
  return {
    poopet,
    gameStarted,
    isGachaOpen,
    isGachaAnimating,
    showEvolutionAnimation,
    isShopOpen,
    isNameInputOpen,
    startGacha,
    pullGacha,
    feedPoopet,
    playWithPoopet,
    cleanPoopet,
    getCurrentAppearance,
    resetGame,
    useStaminaToken,
    purchaseStaminaTokens,
    setIsShopOpen,
    setPoopetName,
    stamina,
    maxStamina,
    staminaTokens,
    lastStaminaRecovery
  };
}; 
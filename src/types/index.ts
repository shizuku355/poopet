export type PoopetType = 'normal' | 'rare' | 'superRare';

// スタミナ関連の定数
export const STAMINA_CONFIG = {
  RECOVERY_RATE: 1,      // 1時間に1回復
  RECOVERY_INTERVAL: 3600000, // 1時間（ミリ秒）
  RECOVERY_ITEM: 5,     // 回復アイテム1個あたりの回復量
  MAX_TOKENS: 99,        // 所持可能な最大回復アイテム数
  MAX_STAMINA: 10,       // 最大スタミナ
  ACTION_COSTS: {
    feed: 1,
    play: 1,
    clean: 1
  }
};

export interface PoopetCharacter {
  id: string;
  name: string;
  type: PoopetType;
  level: number;
  evolutionStages: {
    level1: string; // 画像パス (仮に絵文字を使用)
    level10: string;
    level20: string;
    level50: string;
    level50Special?: string; // 愛情MAX時の特殊進化
  };
  stats: {
    hunger: number; // 満腹度 (0-100)
    happiness: number; // きげん (0-100)
    cleanliness: number; // きれいさ (0-100)
    love: number; // 愛情度 (0-100)
    stamina: number;      // 現在のスタミナ (0-100)
    maxStamina: number;   // 最大スタミナ (デフォルト100、アップグレード可能)
    staminaTokens: number; // スタミナ回復アイテム数
  };
  lastFed: string; // ISO形式の日付文字列
  lastCleaned: string;
  lastActionTime: string;  // 最後にアクションを行った時間
  lastStaminaRecovery: string; // スタミナ回復の最終時刻
  birthDate: string;
  isDead: boolean;
} 
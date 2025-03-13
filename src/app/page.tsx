"use client";

import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import GachaScreen from "../components/GachaScreen";
import PoopetDisplay from "../components/PoopetDisplay";
import StatusDisplay from "../components/StatusDisplay";
import StaminaDisplay from "../components/StaminaDisplay";
import StaminaShopModal from "../components/StaminaShopModal";
import NameInputModal from "../components/NameInputModal";
import { usePoopetGame } from "../hooks/usePoopetGame";

export default function Home() {
  const [language, setLanguage] = useState('ja');
  const { 
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
    lastStaminaRecovery,
  } = usePoopetGame();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-300 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-amber-900 tracking-wider">
            Poopet
          </h1>
          <LanguageSelector 
            language={language}
            onLanguageChange={handleLanguageChange} 
          />
        </div>

        {!gameStarted ? (
          <div className="text-center py-8">
            <p className="mb-6 text-lg font-bold text-amber-900">
              {language === 'ja' 
                ? 'あなただけのうんちっぽいペットを育てよう！' 
                : 'Raise your own poop-like pet!'}
            </p>
            <button 
              onClick={startGacha}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
            >
              {language === 'ja' ? 'はじめる' : 'Start'}
            </button>
          </div>
        ) : isGachaOpen ? (
          <GachaScreen 
            isAnimating={isGachaAnimating} 
            onStartGacha={pullGacha}
            language={language}
          />
        ) : (
          <>
            {poopet && (
              <div className="flex flex-col items-center">
                <PoopetDisplay 
                  appearance={getCurrentAppearance()}
                  level={poopet.level}
                  type={poopet.type}
                  isDead={poopet.isDead}
                  isEvolving={showEvolutionAnimation}
                  name={poopet.name}
                  language={language}
                />
                
                {!poopet.isDead ? (
                  <>
                    <StaminaDisplay
                      stamina={stamina}
                      maxStamina={maxStamina}
                      staminaTokens={staminaTokens}
                      lastStaminaRecovery={lastStaminaRecovery}
                      onUseToken={useStaminaToken}
                      onOpenShop={() => setIsShopOpen(true)}
                      language={language}
                    />
                    
                    <div className="w-full space-y-3 mt-6">
                      <button 
                        onClick={feedPoopet}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg"
                      >
                        {language === 'ja' ? 'えさをあげる' : 'Feed'}
                      </button>
                      <button 
                        onClick={playWithPoopet}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg"
                      >
                        {language === 'ja' ? 'あそぶ' : 'Play'}
                      </button>
                      <button 
                        onClick={cleanPoopet}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg"
                      >
                        {language === 'ja' ? 'おそうじする' : 'Clean'}
                      </button>
                    </div>
                    
                    <StatusDisplay 
                      hunger={poopet.stats.hunger}
                      happiness={poopet.stats.happiness}
                      cleanliness={poopet.stats.cleanliness}
                      love={poopet.stats.love}
                      language={language}
                    />
                  </>
                ) : (
                  <div className="mt-8 text-center">
                    <p className="text-xl text-red-500 font-bold mb-4">
                      {language === 'ja' ? 'ポウペットは死んでしまいました...' : 'Your Poopet has died...'}
                    </p>
                    <button 
                      onClick={resetGame}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
                    >
                      {language === 'ja' ? 'もう一度はじめる' : 'Try Again'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {gameStarted && poopet && !poopet.isDead && (
          <div className="mt-4 text-center text-xs text-amber-700">
            {language === 'ja' 
              ? `生まれた日: ${new Date(poopet.birthDate).toLocaleDateString('ja-JP')}`
              : `Born: ${new Date(poopet.birthDate).toLocaleDateString('en-US')}`}
          </div>
        )}
      </div>

      <StaminaShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onPurchase={purchaseStaminaTokens}
        language={language}
      />

      <NameInputModal
        isOpen={isNameInputOpen}
        onSubmit={setPoopetName}
        language={language}
      />
    </main>
  );
}

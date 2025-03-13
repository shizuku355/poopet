"use client";

interface StaminaShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
  language: string;
}

const SHOP_ITEMS = [
  { amount: 5, price: 0.5 },
  { amount: 10, price: 1 },
  { amount: 20, price: 2 },
  { amount: 50, price: 3 }
];

const StaminaShopModal = ({ isOpen, onClose, onPurchase, language }: StaminaShopModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-900">
            {language === 'ja' ? 'スタミナショップ' : 'Stamina Shop'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {SHOP_ITEMS.map((item) => (
            <button
              key={item.amount}
              onClick={() => {
                onPurchase(item.amount);
                onClose();
              }}
              className="p-4 border-2 border-amber-200 rounded-xl text-center hover:bg-amber-50 transition-colors"
            >
              <p className="text-lg font-bold text-amber-900">
                {item.amount} {language === 'ja' ? 'トークン' : 'Tokens'}
              </p>
              <p className="text-sm text-amber-700">
                {item.price} SUI
              </p>
            </button>
          ))}
        </div>
        
        <p className="text-sm text-center text-amber-700">
          {language === 'ja' 
            ? '※ブロックチェーン連携は近日実装予定です'
            : '* Blockchain integration coming soon'}
        </p>
      </div>
    </div>
  );
};

export default StaminaShopModal; 
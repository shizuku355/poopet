"use client";

interface StatusDisplayProps {
  hunger: number;
  happiness: number;
  cleanliness: number;
  love: number;
  language: string;
}

const StatusBar = ({ value, color, icon }: { value: number, color: string, icon: string }) => {
  const filledBars = Math.floor(value / 20); // 0-100を0-5に変換
  const bars = [];
  
  for (let i = 0; i < 5; i++) {
    if (i < filledBars) {
      bars.push(<span key={i} className={color}>{icon}</span>);
    } else {
      bars.push(<span key={i} className="text-gray-300">○</span>);
    }
  }
  
  return <div className="flex space-x-1">{bars}</div>;
};

const StatusDisplay = ({ hunger, happiness, cleanliness, love, language }: StatusDisplayProps) => {
  return (
    <div className="mt-6 p-4 bg-amber-50 rounded-xl space-y-3">
      <h3 className="text-lg font-bold text-amber-800 mb-3">
        {language === 'ja' ? 'ステータス' : 'Status'}
      </h3>
      
      <div className="flex justify-between items-center">
        <span className="text-amber-700">
          {language === 'ja' ? '満腹度:' : 'Fullness:'}
        </span>
        <StatusBar value={hunger} color="text-red-500" icon="❤️" />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-amber-700">
          {language === 'ja' ? 'きげん:' : 'Mood:'}
        </span>
        <StatusBar value={happiness} color="text-amber-500" icon="⭐" />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-amber-700">
          {language === 'ja' ? 'きれいさ:' : 'Cleanliness:'}
        </span>
        <StatusBar value={cleanliness} color="text-blue-500" icon="✨" />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-amber-700">
          {language === 'ja' ? '愛情:' : 'Love:'}
        </span>
        <StatusBar value={love} color="text-pink-500" icon="💖" />
      </div>
    </div>
  );
};

export default StatusDisplay; 
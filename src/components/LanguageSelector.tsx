"use client";

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="language" className="mr-2 font-bold text-amber-900">
        {language === 'ja' ? '言語:' : 'Language:'}
      </label>
      <select 
        id="language" 
        value={language} 
        onChange={handleChange} 
        className="p-2 border-2 border-amber-500 rounded text-amber-900 font-medium focus:outline-none focus:border-amber-600"
      >
        <option value="ja">日本語</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};

export default LanguageSelector; 
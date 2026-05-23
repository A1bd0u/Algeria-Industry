import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';

const TopBar = () => {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [showLang, setShowLang] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w20/dz.png' }
  ];

  const currencies = ['DZD', 'EUR', 'USD'];

  const currentLang = languages.find(l => i18n.language?.startsWith(l.code)) || languages[0];

  return (
    <div className="bg-[#2a2a2a] text-white py-1.5 border-b border-white/5 hidden md:block relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center text-[11px] font-bold uppercase tracking-wider">
        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => { setShowLang(!showLang); setShowCurrency(false); }}
              className="flex items-center space-x-1.5 hover:text-secondary transition-colors group"
            >
              <img src={currentLang.flag} alt={currentLang.code} className="w-4 h-auto rounded-sm" />
              <span>{currentLang.name}</span>
              <ChevronDown className="h-3 w-3 text-gray-500 group-hover:text-secondary" />
            </button>
            
            <AnimatePresence>
              {showLang && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 mt-1 bg-[#333] border border-white/10 shadow-xl min-w-[120px]"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { 
                        i18n.changeLanguage(lang.code); 
                        setShowLang(false); 
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-white/5 text-left transition-colors"
                    >
                      <img src={lang.flag} alt={lang.code} className="w-4 h-auto rounded-sm" />
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* My Account / Star */}
          <button className="flex items-center space-x-1.5 hover:text-secondary transition-colors">
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <span className="text-white">{t('topbar.my_account')}</span>
            <span className="text-white font-black tracking-tighter">ALGERIA INDUSTRY</span>
          </button>

          {/* Currency */}
          <div className="relative">
            <button 
              onClick={() => { setShowCurrency(!showCurrency); setShowLang(false); }}
              className="flex items-center space-x-1.5 hover:text-secondary transition-colors group"
            >
              <span>{currency} - {currency === 'DZD' ? 'DA' : currency === 'EUR' ? '€' : '$'}</span>
              <ChevronDown className="h-3 w-3 text-gray-500 group-hover:text-secondary" />
            </button>

            <AnimatePresence>
              {showCurrency && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 mt-1 bg-[#333] border border-white/10 shadow-xl min-w-[100px]"
                >
                  {currencies.map(curr => (
                    <button
                      key={curr}
                      onClick={() => { setCurrency(curr as any); setShowCurrency(false); }}
                      className="w-full px-3 py-2 hover:bg-white/5 text-left transition-colors"
                    >
                      {curr}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Become Exhibitor Button */}
          <Link to="/become-exhibitor" className="border border-white/40 px-3 py-1 rounded hover:bg-white hover:text-black transition-all text-[10px]">
            {t('topbar.become_exhibitor')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

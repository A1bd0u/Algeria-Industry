import React, { useState } from 'react';
import { FileText, Download, Search, Filter, ExternalLink, Package, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

const MOCK_CATALOGUES = [
  {
    id: 1,
    title: "Catalogue Pompes Industrielles 2026",
    company: "Algeria Pumps Corp",
    categoryKey: "hydraulic",
    pages: 45,
    size: "12.4 MB",
    date: "Mars 2026",
    thumbnail: "https://picsum.photos/seed/pump-cat/400/500"
  },
  {
    id: 2,
    title: "Solutions Énergie Solaire B2B",
    company: "EcoSolar Algeria",
    categoryKey: "energy",
    pages: 32,
    size: "8.1 MB",
    date: "Février 2026",
    thumbnail: "https://picsum.photos/seed/solar-cat/400/500"
  },
  {
    id: 3,
    title: "Gamme Groupes Électrogènes Diesel",
    company: "PowerGen DZ",
    categoryKey: "energy",
    pages: 64,
    size: "18.2 MB",
    date: "Janvier 2026",
    thumbnail: "https://picsum.photos/seed/gen-cat/400/500"
  },
  {
    id: 4,
    title: "Équipements de Manutention & Levage",
    company: "LiftMaster Algerie",
    categoryKey: "logistics",
    pages: 28,
    size: "5.7 MB",
    date: "Décembre 2025",
    thumbnail: "https://picsum.photos/seed/lift-cat/400/500"
  },
  {
    id: 5,
    title: "Composants Électroniques Industriels",
    company: "Condor B2B",
    categoryKey: "electronic",
    pages: 120,
    size: "24.5 MB",
    date: "Mars 2026",
    thumbnail: "https://picsum.photos/seed/elec-cat/400/500"
  },
  {
    id: 6,
    title: "Systèmes de Compression d'Air",
    company: "Air Industrie Algérie",
    categoryKey: "pneumatic",
    pages: 38,
    size: "9.3 MB",
    date: "Février 2026",
    thumbnail: "https://picsum.photos/seed/air-cat/400/500"
  }
];

const Catalogues = () => {
  const { t, i18n } = useTranslation();
  
  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'energy', label: t('categories.energy') },
    { key: 'hydraulic', label: t('categories.hydraulic') },
    { key: 'logistics', label: t('categories.logistics') },
    { key: 'electronic', label: t('categories.electronic') },
    { key: 'pneumatic', label: t('categories.pneumatic') },
    { key: 'mechanical', label: t('categories.mechanical') }
  ];

  const [selectedCategoryKey, setSelectedCategoryKey] = useState('all');

  const filteredCatalogues = MOCK_CATALOGUES.filter(cat => {
    const matchesCategory = selectedCategoryKey === 'all' || cat.categoryKey === selectedCategoryKey;
    return matchesCategory;
  });

  return (
    <div className={cn("bg-neutral-bg min-h-screen pb-20", i18n.language === 'ar' && "font-arabic")}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-8", i18n.language === 'ar' && "md:flex-row-reverse text-right")}>
            <div className={cn(i18n.language === 'ar' && "ml-auto")}>
              <div className={cn("flex items-center space-x-2 text-secondary mb-4", i18n.language === 'ar' && "flex-row-reverse space-x-reverse justify-end")}>
                <div className="w-8 h-[2px] bg-secondary" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">{t('catalogues.tech_doc')}</span>
              </div>
              <h1 className="text-4xl font-black text-primary uppercase tracking-tighter leading-none">{t('catalogues.title')}</h1>
              <p className="text-gray-500 mt-4 max-w-2xl font-medium uppercase text-xs tracking-wider">
                {t('catalogues.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className={cn("flex flex-wrap gap-2 mb-12", i18n.language === 'ar' && "flex-row-reverse")}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all border",
                selectedCategoryKey === cat.key 
                  ? "bg-primary border-primary text-white shadow-lg hover:bg-secondary hover:border-secondary transition-colors" 
                  : "bg-white border-gray-200 text-gray-500 hover:border-secondary hover:text-secondary"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Catalogues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalogues.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn("bg-white border border-gray-200 group hover:border-secondary transition-all flex flex-col", i18n.language === 'ar' && "text-right")}
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 border-b border-gray-200">
                <img 
                  src={cat.thumbnail} 
                  alt={cat.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-secondary text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
                    <Download className="h-6 w-6" />
                  </button>
                </div>
                <div className={cn("absolute top-4", i18n.language === 'ar' ? "right-4" : "left-4")}>
                  <span className="bg-primary text-white px-3 py-1 text-[9px] font-black uppercase tracking-tighter">
                    {t(`categories.${cat.categoryKey}`)}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className={cn("flex items-center space-x-2 text-[10px] font-mono text-secondary mb-2 font-bold uppercase", i18n.language === 'ar' && "flex-row-reverse space-x-reverse justify-start")}>
                  <Building2 className="h-3 w-3" />
                  <span>{cat.company}</span>
                </div>
                <h3 className="text-lg font-black text-primary uppercase tracking-tighter leading-tight mb-4 group-hover:text-secondary transition-colors">
                  {cat.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t('catalogues.pages')}</span>
                    <span className="text-xs font-mono font-bold text-primary">{cat.pages}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t('catalogues.size')}</span>
                    <span className="text-xs font-mono font-bold text-primary">{cat.size}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t('catalogues.date')}</span>
                    <span className="text-xs font-mono font-bold text-primary">{cat.date}</span>
                  </div>
                </div>

                <div className={cn("mt-6 flex items-center justify-between", i18n.language === 'ar' && "flex-row-reverse")}>
                  <button className={cn("flex items-center space-x-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-secondary transition-colors", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                    <ExternalLink className="h-4 w-4" />
                    <span>{t('catalogues.view')}</span>
                  </button>
                  <button className={cn("flex items-center space-x-2 text-[10px] font-black text-secondary uppercase tracking-widest hover:underline", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                    <Download className="h-4 w-4" />
                    <span>{t('catalogues.download')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCatalogues.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300">
            <FileText className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-primary uppercase tracking-tighter">{t('catalogues.none_found')}</h3>
            <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-widest">{t('catalogues.none_found_text')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogues;

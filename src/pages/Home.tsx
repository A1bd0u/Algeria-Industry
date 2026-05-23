import React, { useState } from 'react';
import { Search, ArrowRight, Building2, Package, FileText, CheckCircle2, Users, ChevronDown, Activity, ArrowUpRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import AdSpace from '../components/AdSpace';

const PARTNERS = [
  { name: "Sonatrach", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sonatrach_Logo.svg/1200px-Sonatrach_Logo.svg.png" },
  { name: "Cevital", logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/a/a3/Logo_Cevital.svg/1200px-Logo_Cevital.svg.png" },
  { name: "Condor", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_Condor_Electronics.svg/1200px-Logo_Condor_Electronics.svg.png" },
  { name: "Ooredoo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ooredoo_logo.svg/1200px-Ooredoo_logo.svg.png" },
  { name: "Djezzy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Djezzy_logo.svg/1200px-Djezzy_logo.svg.png" },
  { name: "Mobilis", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_Mobilis.svg/1200px-Logo_Mobilis.svg.png" },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Pompe Centrifuge Industrielle",
    category: "Mécanique",
    company: "Algeria Pumps Corp",
    image: "https://picsum.photos/seed/pump/400/400",
    price: "Sur devis"
  },
  {
    id: 2,
    name: "Panneau Solaire 450W Monocristallin",
    category: "Énergie",
    company: "EcoSolar Algeria",
    image: "https://picsum.photos/seed/solar/400/400",
    price: 25000
  },
  {
    id: 3,
    name: "Groupe Électrogène 100kVA",
    category: "Énergie",
    company: "PowerGen DZ",
    image: "https://picsum.photos/seed/generator/400/400",
    price: 1200000
  },
  {
    id: 4,
    name: "Chariot Élévateur Électrique",
    category: "Logistique",
    company: "LiftMaster Algerie",
    image: "https://picsum.photos/seed/forklift/400/400",
    price: "Sur devis"
  },
  {
    id: 5,
    name: "Compresseur d'Air Industriel",
    category: "Mécanique",
    company: "AirTech DZ",
    image: "https://picsum.photos/seed/compressor/400/400",
    price: 450000
  },
  {
    id: 6,
    name: "Transformateur Électrique 630kVA",
    category: "Énergie",
    company: "ElecTrans Algerie",
    image: "https://picsum.photos/seed/transformer/400/400",
    price: "Sur devis"
  },
  {
    id: 7,
    name: "Unité de Filtration d'Eau",
    category: "Environnement",
    company: "PureWater DZ",
    image: "https://picsum.photos/seed/filter/400/400",
    price: "850 000 DZD"
  },
  {
    id: 8,
    name: "Robot de Soudage Automatique",
    category: "Automatisme",
    company: "AutoWeld DZ",
    image: "https://picsum.photos/seed/welding/400/400",
    price: "Sur devis"
  }
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const [visibleProducts, setVisibleProducts] = useState(4);

  const showMore = () => {
    setVisibleProducts(prev => Math.min(prev + 4, FEATURED_PRODUCTS.length));
  };
  
  return (
    <div className={cn("flex flex-col min-h-screen", i18n.language === 'ar' && "font-arabic")}>
      {/* Stats Section (Technical Dashboard Style) */}
      <section className="py-12 bg-white border-b border-border-tech">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-tech divide-y md:divide-y-0 md:divide-x divide-border-tech",
            i18n.language === 'ar' && "md:divide-x-reverse"
          )}>
            <div className={cn("p-8 hover:bg-neutral-bg transition-colors group", i18n.language === 'ar' && "text-right")}>
              <span className="tech-label">{i18n.language === 'ar' ? 'قاعدة البيانات' : 'Base de données'}</span>
              <div className={cn("flex items-baseline space-x-2", i18n.language === 'ar' && "space-x-reverse justify-end")}>
                <span className="text-4xl font-black text-primary tech-mono">550,000+</span>
                <span className="text-xs font-bold text-secondary uppercase tracking-tighter">SKU</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-medium uppercase tracking-wider">
                {i18n.language === 'ar' ? 'المكونات والمعدات الصناعية المرجعية' : 'Composants et équipements industriels référencés'}
              </p>
            </div>
            <div className={cn("p-8 hover:bg-neutral-bg transition-colors group", i18n.language === 'ar' && "text-right")}>
              <span className="tech-label">{i18n.language === 'ar' ? 'حركة الشبكة' : 'Trafic Réseau'}</span>
              <div className={cn("flex items-baseline space-x-2", i18n.language === 'ar' && "space-x-reverse justify-end")}>
                <span className="text-4xl font-black text-primary tech-mono">2.7M</span>
                <span className="text-xs font-bold text-secondary uppercase tracking-tighter">REQ/MO</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-medium uppercase tracking-wider">
                {i18n.language === 'ar' ? 'صناع القرار والمهندسين المتصلين شهرياً' : 'Décideurs et ingénieurs connectés mensuellement'}
              </p>
            </div>
            <div className={cn("p-8 hover:bg-neutral-bg transition-colors group", i18n.language === 'ar' && "text-right")}>
              <span className="tech-label">{i18n.language === 'ar' ? 'الشهادات' : 'Certification'}</span>
              <div className={cn("flex items-baseline space-x-2", i18n.language === 'ar' && "space-x-reverse justify-end")}>
                <span className="text-4xl font-black text-primary tech-mono">5,000+</span>
                <span className="text-xs font-bold text-secondary uppercase tracking-tighter">ISO</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-medium uppercase tracking-wider">
                {i18n.language === 'ar' ? 'الشركات المحلية والدولية المعتمدة' : 'Entreprises locales et internationales certifiées'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Slider */}
      <section className="py-8 bg-neutral-bg border-b border-border-tech overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 overflow-x-auto no-scrollbar pb-2",
            i18n.language === 'ar' && "flex-row-reverse"
          )}>
            {PARTNERS.map((partner, i) => (
              <img 
                key={i} 
                src={partner.logo} 
                alt={partner.name} 
                className="h-6 md:h-10 w-auto object-contain flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tenders Activity Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex flex-col md:flex-row items-end justify-between mb-12", i18n.language === 'ar' && "md:flex-row-reverse")}>
            <div className={i18n.language === 'ar' ? "text-right" : ""}>
              <div className={cn("flex items-center space-x-3 mb-4", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Activity className="h-6 w-6" />
                </div>
                <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] font-sans">Activité du Réseau</h2>
              </div>
              <h3 className="text-3xl font-black text-primary font-sans leading-none uppercase tracking-tighter">Derniers Appels d'Offres</h3>
            </div>
            <Link to="/tenders" className="group flex items-center space-x-3 mt-6 md:mt-0">
              <span className="text-[11px] font-black uppercase tracking-widest text-primary/40 group-hover:text-secondary transition-colors">Explorer tous les projets</span>
              <div className="p-2 border border-primary/10 rounded-full group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[
                { title: "Fourniture de Transformateurs 630kVA", company: "Sonelgaz", time: "Il y a 2h", sector: "Électricité", status: "Urgent", color: "border-red-500" },
                { title: "Audit et Inspection de Pipelines", company: "Sonatrach", time: "Il y a 5h", sector: "Hydrocarbures", status: "Ouvert", color: "border-secondary" },
                { title: "Remplacement Unités de Filtration", company: "Seaal", time: "Il y a 1j", sector: "Hydraulique", status: "Ouvert", color: "border-secondary" },
              ].map((tender, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "bg-neutral-bg p-6 border-l-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center justify-between",
                    tender.color,
                    i18n.language === 'ar' && "flex-row-reverse text-right"
                  )}
                >
                  <div className="flex-1">
                    <div className={cn("flex items-center space-x-3 mb-2", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                      <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{tender.sector}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tender.time}</span>
                    </div>
                    <h4 className="text-lg font-black text-primary leading-tight uppercase group-hover:text-secondary transition-colors mb-2">{tender.title}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tender.company}</p>
                  </div>
                  <div className={cn("flex flex-col items-end space-y-4 ml-6", i18n.language === 'ar' && "ml-0 mr-6 items-start")}>
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest",
                      tender.status === 'Urgent' ? "bg-red-500 text-white" : "bg-success/10 text-success"
                    )}>
                      {tender.status}
                    </span>
                    <button className="p-2 bg-white text-gray-400 group-hover:bg-primary group-hover:text-white transition-all rounded-xl border border-gray-100 flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-primary p-8 rounded-[40px] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <FileText className="h-40 w-40" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-6 relative z-10">Opportunités Pro</h4>
              <h5 className="text-3xl font-black mb-8 leading-tight relative z-10">Publiez votre besoin technique aujourd'hui</h5>
              <p className="text-white/60 text-sm mb-10 leading-relaxed font-bold relative z-10">Accédez à un réseau de +1,200 entreprises certifiées prêtes à répondre à vos demandes.</p>
              <Link to="/tenders" className="btn-secondary w-full py-4 rounded-2xl flex items-center justify-center space-x-3 relative z-10">
                <Plus className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-widest text-center">Lancer un Appel d'Offre</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6", i18n.language === 'ar' && "md:flex-row-reverse")}>
            <div className={cn("max-w-2xl", i18n.language === 'ar' && "text-right")}>
              <div className={cn("flex items-center space-x-2 text-secondary mb-4", i18n.language === 'ar' && "space-x-reverse justify-end")}>
                <div className="w-8 h-[2px] bg-secondary" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">{i18n.language === 'ar' ? 'المواصفات الفنية' : 'Spécifications Techniques'}</span>
              </div>
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-none mb-4">{t('home.trends')}</h2>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{t('home.trends_subtitle')}</p>
            </div>
            <button 
              onClick={() => {}}
              className={cn("btn-primary flex items-center space-x-3 group", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}
            >
              <span className={cn(i18n.language === 'ar' && "text-sm")}>{i18n.language === 'ar' ? 'الوصول إلى الكتالوج الكامل' : 'ACCÉDER AU CATALOGUE COMPLET'}</span>
              <ArrowRight className={cn("h-4 w-4 group-hover:translate-x-1 transition-transform", i18n.language === 'ar' && "rotate-180 group-hover:-translate-x-1")} />
            </button>
          </div>

          <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-border-tech", i18n.language === 'ar' && "border-l-0 border-r")}>
            {FEATURED_PRODUCTS.slice(0, visibleProducts).map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="bg-white border-r border-b border-border-tech p-6 hover:bg-neutral-bg transition-all group relative"
              >
                <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden mb-6 bg-gray-50 border border-border-tech p-4 group-hover:border-secondary transition-colors">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className={cn("space-y-4", i18n.language === 'ar' && "text-right")}>
                  <div>
                    <span className="tech-label">{product.company}</span>
                    <Link to={`/products/${product.id}`}>
                      <h3 className={cn("text-sm font-black text-primary uppercase tracking-tight line-clamp-2 min-h-[40px] group-hover:text-secondary transition-colors", i18n.language === 'ar' && "text-base tracking-normal")}>
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  
                  <div className={cn("flex items-center justify-between pt-4 border-t border-border-tech", i18n.language === 'ar' && "flex-row-reverse")}>
                    <div className={cn("flex flex-col", i18n.language === 'ar' && "text-right")}>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{i18n.language === 'ar' ? 'السعر' : 'Cotation'}</span>
                      <span className="text-sm font-mono font-bold text-primary">{formatPrice(product.price)}</span>
                    </div>
                    <Link to={`/products/${product.id}`} className="bg-primary text-white p-2 hover:bg-secondary transition-colors">
                      <ArrowRight className={cn("h-4 w-4", i18n.language === 'ar' && "rotate-180")} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {visibleProducts < FEATURED_PRODUCTS.length && (
            <div className="mt-16 text-center">
              <button 
                onClick={showMore}
                className="btn-primary"
              >
                {t('home.read_more')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-neutral-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-12">
            {i18n.language === 'ar' ? 'لماذا تختار ألجيريا إنداستري؟' : 'Pourquoi choisir Algeria Industry ?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              i18n.language === 'ar' ? 'زيادة الرؤية للموردين' : "Visibilité accrue pour les fournisseurs",
              i18n.language === 'ar' ? 'تبسيط عمليات التوريد للمشترين' : "Sourcing simplifié pour les acheteurs",
              i18n.language === 'ar' ? 'منصة آمنة بنسبة ١٠٠٪' : "Plateforme 100% sécurisée",
              i18n.language === 'ar' ? 'دعم فني محلي' : "Support technique local"
            ].map((text, i) => (
              <div key={i} className={cn("flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow-sm border border-border-tech", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Besoin d'aide Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 -skew-x-12 translate-x-1/2" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", i18n.language === 'ar' && "lg:flex lg:flex-row-reverse lg:justify-between")}>
            <div className={i18n.language === 'ar' ? "text-right" : ""}>
              <div className={cn("flex items-center space-x-2 text-secondary mb-6", i18n.language === 'ar' && "space-x-reverse justify-end")}>
                <div className="w-8 h-[2px] bg-secondary" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">{t('footer.support')}</span>
              </div>
              <h2 className={cn("text-5xl font-black uppercase tracking-tighter leading-none mb-8", i18n.language === 'ar' && "text-6xl")}>
                {i18n.language === 'ar' ? 'هل تحتاج إلى' : "Besoin d'un"} <span className="text-secondary">{i18n.language === 'ar' ? 'دعم' : 'Accompagnement'}</span> {i18n.language === 'ar' ? 'فني؟' : 'Technique ?'}
              </h2>
              <p className="text-lg text-gray-300 font-medium leading-relaxed mb-12 max-w-xl">
                {i18n.language === 'ar' ? 'خبراؤنا الصناعيون في خدمتكم لمساعدتكم في عمليات التوريد أو التسجيل أو لأي سؤال فني حول استخدام البوابة.' : 
                "Nos experts industriels sont à votre disposition pour vous aider dans votre sourcing, votre référencement ou pour toute question technique sur l'utilisation du portail."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className={cn("flex items-start space-x-4", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div className={i18n.language === 'ar' ? "text-right" : ""}>
                    <h4 className="font-bold uppercase tracking-tight text-sm">{i18n.language === 'ar' ? 'مساعدة مباشرة' : 'Assistance Live'}</h4>
                    <p className="text-xs text-gray-400 font-medium">{i18n.language === 'ar' ? 'استجابة فورية حسب التوافر' : 'Réponse immédiate selon disponibilité'}</p>
                  </div>
                </div>
                <div className={cn("flex items-start space-x-4", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-secondary" />
                  </div>
                  <div className={i18n.language === 'ar' ? "text-right" : ""}>
                    <h4 className="font-bold uppercase tracking-tight text-sm">{i18n.language === 'ar' ? 'قاعدة المعرفة' : 'Base de connaissances'}</h4>
                    <p className="text-xs text-gray-400 font-medium">{i18n.language === 'ar' ? 'الوصول إلى الأدلة والدروس التعليمية' : 'Accédez aux guides et tutoriels'}</p>
                  </div>
                </div>
              </div>

              <div className={cn("flex flex-wrap gap-4", i18n.language === 'ar' && "justify-end")}>
                <Link to="/contact" className={cn("btn-secondary px-10 py-5 font-black uppercase tracking-widest text-sm flex items-center space-x-3", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                  <span>{i18n.language === 'ar' ? 'اتصل بخبير' : 'Contactez un expert'}</span>
                  <ArrowRight className={cn("h-4 w-4", i18n.language === 'ar' && "rotate-180")} />
                </Link>
                <Link to="/faq" className="bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-5 font-black uppercase tracking-widest text-sm transition-all">
                  {i18n.language === 'ar' ? 'الأسئلة الشائعة' : 'Consulter la F.A.Q'}
                </Link>
              </div>
            </div>

            <div className="relative group lg:block hidden">
              <div className="absolute -inset-4 border border-secondary/30 rounded-[40px] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[40px] relative overflow-hidden">
                <div className={cn("absolute top-0 p-8", i18n.language === 'ar' ? "left-0" : "right-0")}>
                  <div className={cn("flex items-center space-x-2", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                    <span className="w-2 h-2 bg-success rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-success uppercase tracking-widest">{i18n.language === 'ar' ? 'الدعم عبر الإنترنت' : 'Support en ligne'}</span>
                  </div>
                </div>
                
                <h3 className={cn("text-2xl font-black uppercase tracking-tight mb-8", i18n.language === 'ar' && "text-right")}>
                  {i18n.language === 'ar' ? 'إحصائيات الدعم' : 'Statistiques de support'}
                </h3>
                <div className="space-y-6">
                  {[
                    { label: i18n.language === 'ar' ? "متوسط وقت الاستجابة" : "Temps de réponse moyen", value: "< 15 min", color: "bg-secondary" },
                    { label: i18n.language === 'ar' ? "معدل الرضا" : "Taux de satisfaction", value: "98.4%", color: "bg-success" },
                    { label: i18n.language === 'ar' ? "الطلبات المحلولة / شهر" : "Tickets résolus / mois", value: "2,450+", color: "bg-blue-500" },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <div className={cn("flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400", i18n.language === 'ar' && "flex-row-reverse")}>
                        <span>{stat.label}</span>
                        <span className="text-white">{stat.value}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                          className={cn("h-full", stat.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-primary rounded-2xl border border-white/5">
                  <div className={cn("flex items-center space-x-4 mb-4", i18n.language === 'ar' && "flex-row-reverse space-x-reverse")}>
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className={i18n.language === 'ar' ? "text-right" : ""}>
                      <p className="text-xs font-black uppercase tracking-widest text-white">{i18n.language === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Prêt à démarrer ?'}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{i18n.language === 'ar' ? 'سجل شركتك في دقيقتين' : 'Inscrivez votre entreprise en 2 minutes'}</p>
                    </div>
                  </div>
                  <Link to="/register" className="w-full bg-white text-primary py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                    {i18n.language === 'ar' ? 'إنشاء ملف تعريفي للمورد' : 'Créer mon profil fournisseur'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Home;

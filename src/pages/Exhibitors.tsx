import {
  Factory,
  Layout,
  MapPin,
  MessageSquare,
  Search, ShieldCheck, Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const Exhibitors = () => {
  const { i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const sectors = ['Tous', 'Métallurgie', 'Pétrochimie', 'Automobile', 'Agro-Industrie', 'Énergie Solaire'];

  const exhibitors = [
    {
      id: 1,
      name: 'Algerian Industrial Solutions (AIS)',
      sector: 'Automobile',
      location: 'Alger, Zone Industrielle Rouiba',
      description: 'Leader dans la fabrication de composants mécaniques de précision.',
      logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=200&auto=format&fit=crop',
      stats: { products: 145, views: '12K', employees: '250+' },
      verified: true
    },
    {
      id: 2,
      name: 'EcoEnergy Algeria',
      sector: 'Énergie Solaire',
      location: 'Oran, Es Sénia',
      description: 'Solutions photovoltaïques industrielles et stockage d\'énergie.',
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200&auto=format&fit=crop',
      stats: { products: 42, views: '8K', employees: '85' },
      verified: true
    },
    {
      id: 3,
      name: 'Métal Nord Spa',
      sector: 'Métallurgie',
      location: 'Sétif, Zone Industrielle',
      description: 'Transformation d\'acier et structures métalliques lourdes.',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
      stats: { products: 88, views: '5K', employees: '180' },
      verified: false
    }
  ];

  return (
    <div className={cn("min-h-screen bg-neutral-bg pt-32 pb-20", i18n.language === 'ar' && "font-arabic")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-secondary mb-4"
            >
              <Factory className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Annuaire Entreprises</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter leading-none mb-6">
              Exposants & <span className="text-secondary">Partenaires</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Découvrez l'écosystème industriel algérien. Trouvez des partenaires stratégiques et explorez les leaders de chaque secteur.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Exposants Actifs</p>
              <p className="text-2xl font-black text-secondary tracking-tighter">542+</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="text-right">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Secteurs</p>
              <p className="text-2xl font-black text-secondary tracking-tighter">18</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search className="h-5 w-5 text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Rechercher une entreprise par nom ou activité..."
              className="flex-1 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }} className="px-6 py-3 bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-secondary transition-all">
              Rechercher
            </button>
          </div>
          <div className="flex gap-4">
            <select className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
              <option>Tous les Secteurs</option>
              {sectors.slice(1).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibitors.map((exhibitor, idx) => (
            <motion.div 
              key={exhibitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[40px] p-8 border border-gray-100 hover:shadow-2xl hover:border-secondary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-3 overflow-hidden group-hover:scale-105 transition-transform">
                  <img src={exhibitor.logo} alt={exhibitor.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col items-end">
                  {exhibitor.verified && (
                    <div className="flex items-center space-x-1.5 bg-secondary/5 px-3 py-1 rounded-full text-secondary mb-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span className="text-[9px] font-black uppercase">Vérifié</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">{exhibitor.sector}</p>
                <h3 className="text-xl font-black text-primary uppercase tracking-tight group-hover:text-secondary transition-colors mb-4 line-clamp-1">
                  {exhibitor.name}
                </h3>
                <div className="flex items-center text-gray-400 mb-6">
                  <MapPin className="h-3.5 w-3.5 mr-2 shrink-0 text-secondary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate">{exhibitor.location}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4">
                  "{exhibitor.description}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-gray-50">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Produits</p>
                  <p className="text-sm font-black text-primary">{exhibitor.stats.products}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Visites</p>
                  <p className="text-sm font-black text-primary">{exhibitor.stats.views}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Taille</p>
                  <p className="text-sm font-black text-primary">{exhibitor.stats.employees}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to={`/directory/${exhibitor.id}`} className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20">
                  <Layout className="h-4 w-4" />
                  <span>Visiter le Stand</span>
                </Link>
                <Link to="/contact" className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:text-secondary hover:bg-secondary/5 transition-all">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-20 bg-primary rounded-[48px] p-12 text-white relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 opacity-5" 
               style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
              Vous aussi, <span className="text-secondary">Exposez ICI</span>
            </h2>
            <p className="text-white/60 font-medium mb-10 text-lg">
              Ne manquez pas l'opportunité de présenter vos innovations au plus grand réseau industriel du pays.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/become-exhibitor" className="btn-secondary px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-secondary/30">
                Devenir Exposant
              </Link>
              <Link to="/subscriptions" className="bg-white/10 border border-white/20 px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center">
                Voir toutes les options
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Exhibitors;

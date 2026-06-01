import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, SlidersHorizontal, Grid, List as ListIcon, 
  ChevronDown, ArrowRight, Zap, ShieldCheck, Star, 
  Settings, Wrench, Package, Truck, Loader2, AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Products = () => {
  const { i18n } = useTranslation();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');

  const categories = [
    'Tous', 'Usinage', 'Plasturgie', 'Énergie', 'BTP', 'Logistique', 'Agroalimentaire', 'Hydraulique', 'Pneumatique', 'Outillage'
  ];

  const regions = ["Alger", "Oran", "Constantine", "Béjaïa", "Sétif", "Bordj Bou Arreridj"];

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/products').catch(() => null);
        
        let data = [
           { id: 1, name: "Unité de Filtration Haute Pression", price: "Sur demande", category: "Agroalimentaire", region: "Alger", verified: true, brand: "Global Filtration", image: "https://picsum.photos/seed/p1/600/400" },
           { id: 2, name: "Générateur Industriel 500kW", price: "450 000 DA", category: "Énergie", region: "Oran", verified: true, brand: "Elec DZ", image: "https://picsum.photos/seed/p2/600/400" },
           { id: 3, name: "Pompe Centrifuge A200", price: "120 000 DA", category: "Hydraulique", region: "Sétif", verified: false, brand: "MecaTech", image: "https://picsum.photos/seed/p3/600/400" }
        ];

        if (res && res.ok) {
           data = await res.json();
        }
        
        // Formatter les données pour le catalogue complet (simuler des données supplémentaires)
        data = data.map((p: any) => ({
           id: p.id,
           name: p.name,
           brand: p.brand || 'Marque Standard',
           price: p.price,
           category: p.cat || p.category,
           region: regions[Math.floor(Math.random() * regions.length)], // Mock logic for demo
           image: p.image || p.file_url || `https://picsum.photos/seed/${p.id}/600/400`,
           features: p.features || ['Précision', 'Haute Performance'],
           verified: p.verified !== undefined ? p.verified : true
        }));

        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
     if (activeCategory !== 'Tous' && product.category !== activeCategory) return false;
     if (selectedRegion !== 'Toutes les régions' && product.region !== selectedRegion) return false;
     if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) ||
               product.brand.toLowerCase().includes(query) ||
               product.category.toLowerCase().includes(query);
     }
     return true;
  });

  return (
    <div className={cn("min-h-screen bg-neutral-bg pt-32 pb-20", i18n.language === 'ar' && "font-arabic")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-secondary mb-4"
            >
              <Package className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sourcing Industriel</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter leading-none mb-6">
              Catalogue <span className="text-secondary">Équipements</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-lg">
              Explorez les meilleures technologies industrielles disponibles en Algérie. Comparez, demandez des devis et connectez-vous aux fournisseurs.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-3 rounded-xl transition-all", view === 'grid' ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-primary")}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-3 rounded-xl transition-all", view === 'list' ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-primary")}
            >
              <ListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters & Categories */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Filtres</h3>
                <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Catégorie</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all",
                          activeCategory === cat ? "bg-primary text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Région</label>
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-gray-50 border-none p-3 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-secondary/20"
                  >
                    <option value="Toutes les régions">Toutes les régions</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Type de Vente</label>
                  <div className="space-y-2">
                    {['Neuf', 'Occasions Rénovées', 'Déstockage'].map(type => (
                      <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border-2 border-gray-100 group-hover:border-secondary transition-all" />
                        <span className="text-xs font-bold text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden">
              <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
              <h4 className="text-xl font-black mb-4 leading-tight uppercase">Vendez vos Machines</h4>
              <p className="text-white/60 text-[10px] font-medium mb-6 uppercase tracking-widest">Rejoignez 500+ fournisseurs en Algérie</p>
              <Link to="/contact" className="w-full py-4 bg-secondary rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 transition-all text-center block">
                Ajouter un produit
              </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center bg-white p-2 rounded-2xl border border-gray-100">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <input 
                type="text"
                placeholder="Rechercher une machine, une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none"
              />
              <button className="px-6 py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-gray-100">
                Rechercher
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                 <Loader2 className="h-10 w-10 text-secondary animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-8 border border-red-100 font-bold flex items-center mb-8">
                 <AlertCircle className="h-6 w-6 mr-3" />
                 {error}
              </div>
            ) : filteredProducts.length === 0 ? (
               <div className="bg-white p-8 text-center border border-gray-200">
                  <p className="text-gray-500 font-bold uppercase">Aucun produit trouvé.</p>
               </div>
            ) : (
            <div className={cn(
              "grid gap-6",
              view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredProducts.map(product => (
                <motion.div 
                  layout
                  key={product.id}
                  className={cn(
                    "bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group",
                    view === 'list' && "flex md:flex-row"
                  )}
                >
                  <div className={cn("relative overflow-hidden", view === 'grid' ? "aspect-[4/3]" : "md:w-72 aspect-square")}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase text-primary border border-white/20">
                        {product.category}
                      </span>
                      {product.verified && (
                        <div className="bg-secondary p-1.5 rounded-full text-white shadow-lg">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase">{product.brand}</span>
                        <button className="text-gray-300 hover:text-secondary transition-colors">
                          <Star className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="text-lg font-black text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">
                        {product.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-2 mb-6">
                        {product.features.map((f, i) => (
                          <div key={i} className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold uppercase italic">
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-6">
                        <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                          📍 {product.region}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Citations</p>
                        <p className="text-lg font-black text-primary uppercase tracking-tighter">{product.price}</p>
                      </div>
                      <Link to={`/products/${product.id}`} className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20">
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            {/* Pagination Placeholder */}
            <div className="mt-12 flex items-center justify-center space-x-2">
              <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all">1</button>
              <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg">2</button>
              <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all">3</button>
              <span className="px-2 text-gray-300">...</span>
              <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all">
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;

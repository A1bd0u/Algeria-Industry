import {
  ArrowLeft,
  ArrowRight,
  FileText,
  GitCompare,
  Globe,
  Heart,
  Layers,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductDetailSkeleton } from '../components/Skeleton';
import { Product as IProduct, useComparison } from '../context/ComparisonContext';
import { useCurrency } from '../context/CurrencyContext';
import { cn } from '../lib/utils';

const ProductDetail = () => {
  const [activeTab, setActiveTab] = React.useState('description');
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { comparedProducts, addToCompare, removeFromCompare } = useComparison();
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock product data logic inside useEffect to simulate fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [id]);

  // Mock product data logic
  const product = {
    id: id || "0",
    name: "Unité de Filtration Industrielle X-Pro",
    brand: "AF SYS",
    company: "Algeria Filtration Systems",
    price: 850000,
    category: "Hydraulique",
    rating: 4.8,
    reviews: 24,
    stock: "En Stock",
    image: "https://picsum.photos/seed/filter1/800/800",
    images: [
      "https://picsum.photos/seed/filter1/800/800",
      "https://picsum.photos/seed/filter2/800/800",
      "https://picsum.photos/seed/filter3/800/800",
    ],
    description: "Système de filtration haute performance conçu pour les environnements de production intensifs. Élimine 99.9% des impuretés microscopiques avec un débit constant.",
    specs: { 
      "Modèle": "FILT-2026-XP",
      "Débit": "500 L/min",
      "Pression Max": "10 Bar",
      "Matériau": "Acier Inoxydable 316L",
      "Poids": "45 kg",
      "Alimentation": "380V / 50Hz"
    },
    features: [
      "Nettoyage automatique intégré",
      "Contrôle numérique de la pression",
      "Installation plug-and-play",
      "Garantie constructeur 5 ans"
    ]
  };

  const isCompared = comparedProducts.find(p => p.id === product.id);

  const toggleCompare = () => {
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product as unknown as IProduct);
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="bg-neutral-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs / Back */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Retour au catalogue</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm relative group">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-12"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 right-6 flex flex-col space-y-3">
                <button className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-gray-400 hover:text-error transition-colors" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                  <Heart className="h-5 w-5" />
                </button>
                <button className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-gray-400 hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "aspect-square rounded-2xl border-2 overflow-hidden bg-white transition-all",
                    activeImage === i ? "border-secondary scale-95 shadow-inner" : "border-gray-100 opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover p-2" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="tech-label">{product.category}</span>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-bold text-primary">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.reviews} avis)</span>
                </div>
              </div>
              <h1 className="text-4xl font-black text-primary uppercase tracking-tighter leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm font-bold text-secondary uppercase tracking-widest flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Fabricant : {product.company}</span>
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cotation actuelle</p>
                  <p className="text-4xl font-mono font-black text-primary tracking-tighter">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-success/10 text-success text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {product.stock}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Référence : XP-2026-DZ</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/tenders?product=${encodeURIComponent(product.name)}`)}
                  className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center space-x-3 text-lg group"
                >
                  <FileText className="h-6 w-6" />
                  <span>DEMANDER UN DEVIS PROFESSIONNEL</span>
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={toggleCompare}
                    className={cn(
                      "flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all border",
                      isCompared 
                        ? "bg-secondary/10 border-secondary text-secondary" 
                        : "bg-neutral-bg text-primary border-gray-100 hover:bg-gray-100"
                    )}
                  >
                    <GitCompare className="h-5 w-5" />
                    <span>{isCompared ? "Comparé" : "Comparer"}</span>
                  </button>
                  <button className="bg-neutral-bg text-primary py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-gray-100 transition-all border border-gray-100" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                    <MessageSquare className="h-5 w-5" />
                    <span>Contact Direct</span>
                  </button>
                  <button 
                    onClick={toggleCompare}
                    className={cn(
                      "py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2 transition-all border",
                      isCompared 
                        ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" 
                        : "bg-neutral-bg text-primary border-gray-100 hover:bg-gray-100"
                    )}
                  >
                    <Layers className="h-5 w-5" />
                    <span>{isCompared ? "Comparé" : "Comparer"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Garantie</p>
                  <p className="text-sm font-bold text-primary">5 Ans Constructeur</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Livraison</p>
                  <p className="text-sm font-bold text-primary">Sur toute l'Algérie</p>
                </div>
              </div>
            </div>

            {/* Tabs for detailed content */}
            <div className="space-y-6">
              <div className="flex space-x-8 border-b border-gray-200">
                <button className={`pb-4 border-b-2 ${activeTab === 'description' ? 'border-secondary text-primary' : 'border-transparent text-gray-400 hover:text-primary'} text-sm font-black uppercase tracking-widest transition-all`} onClick={() => setActiveTab('description')}>Description</button>
                <button className={`pb-4 border-b-2 ${activeTab === 'specs' ? 'border-secondary text-primary' : 'border-transparent text-gray-400 hover:text-primary'} text-sm font-black uppercase tracking-widest transition-all`} onClick={() => setActiveTab('specs')}>Spécifications</button>
                <button className={`pb-4 border-b-2 ${activeTab === 'downloads' ? 'border-secondary text-primary' : 'border-transparent text-gray-400 hover:text-primary'} text-sm font-black uppercase tracking-widest transition-all`} onClick={() => setActiveTab('downloads')}>Téléchargements</button>
              </div>
              
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p>Description détaillée du produit {product.name} par {product.company}. Conçu pour les professionnels exigeants, ce produit offre une fiabilité exceptionnelle et des performances de pointe dans son domaine d'application.</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                      <span className="text-sm font-bold text-primary">{val as string}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'downloads' && (
                <div className="space-y-3">
                  <button onClick={() => {
                     const a = document.createElement('a');
                     a.href = URL.createObjectURL(new Blob(['Fiche PDF'], {type: 'application/pdf'}));
                     a.download = `fiche_${product.name.toLowerCase().replace(/ /g, '_')}.pdf`;
                     a.click();
                  }} className="flex items-center space-x-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-left w-full">
                     <span className="bg-primary/5 p-2 rounded-lg text-primary">📄</span>
                     <div>
                       <p className="text-sm font-bold text-primary">Manuel d'utilisation</p>
                       <p className="text-[10px] text-gray-400 uppercase tracking-widest">PDF - 2.4 MB</p>
                     </div>
                  </button>
                </div>
              )}
            </div>
  
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

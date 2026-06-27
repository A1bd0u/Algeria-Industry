import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Edit2,
  FileText,
  Heart,
  Info,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';


// Mock data for charts
const dataAcheteur = [
  { name: 'Jan', bids: 4, messages: 12, views: 0, clics: 0 },
  { name: 'Fév', bids: 6, messages: 15, views: 0, clics: 0 },
  { name: 'Mar', bids: 8, messages: 24, views: 0, clics: 0 },
  { name: 'Avr', bids: 12, messages: 32, views: 0, clics: 0 },
  { name: 'Mai', bids: 15, messages: 45, views: 0, clics: 0 },
  { name: 'Juin', bids: 20, messages: 56, views: 0, clics: 0 },
];

const dataFournisseur = [
  { name: 'Jan', views: 400, clics: 24, bids: 0, messages: 0 },
  { name: 'Fév', views: 300, clics: 13, bids: 0, messages: 0 },
  { name: 'Mar', views: 600, clics: 38, bids: 0, messages: 0 },
  { name: 'Avr', views: 800, clics: 42, bids: 0, messages: 0 },
  { name: 'Mai', views: 500, clics: 25, bids: 0, messages: 0 },
  { name: 'Juin', views: 900, clics: 56, bids: 0, messages: 0 },
];

const dataAcheteur1y = [
  ...dataAcheteur,
  { name: 'Juil', bids: 22, messages: 60, views: 0, clics: 0 },
  { name: 'Août', bids: 18, messages: 50, views: 0, clics: 0 },
  { name: 'Sep', bids: 25, messages: 70, views: 0, clics: 0 },
  { name: 'Oct', bids: 30, messages: 85, views: 0, clics: 0 },
  { name: 'Nov', bids: 35, messages: 95, views: 0, clics: 0 },
  { name: 'Déc', bids: 42, messages: 110, views: 0, clics: 0 },
];

const dataFournisseur1y = [
  ...dataFournisseur,
  { name: 'Juil', views: 850, clics: 50, bids: 0, messages: 0 },
  { name: 'Août', views: 700, clics: 40, bids: 0, messages: 0 },
  { name: 'Sep', views: 1100, clics: 65, bids: 0, messages: 0 },
  { name: 'Oct', views: 1300, clics: 80, bids: 0, messages: 0 },
  { name: 'Nov', views: 1500, clics: 95, bids: 0, messages: 0 },
  { name: 'Déc', views: 1800, clics: 120, bids: 0, messages: 0 },
];

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [tenderStep, setTenderStep] = useState(1);
  const [tenderFormData, setTenderFormData] = useState({
    title: '',
    sector: "Énergie & Hydrocarbures",
    budget: '',
    description: '',
    location: "Alger (Rouiba / Dar el Beida)",
    deadline: '',
    file_url: ''
  });

  const [uploadingTenderFile, setUploadingTenderFile] = useState(false);

  const handleTenderFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setUploadingTenderFile(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setTenderFormData(prev => ({ ...prev, file_url: data.url }));
      } else {
        const errText = await res.text();
        console.error('Erreur upload tender file:', res.status, errText);
      }
    } catch(err) {
      console.error(err);
    }
    setUploadingTenderFile(false);
  };

  const [adFormData, setAdFormData] = useState({
    name: '',
    type: 'Bannière Accueil',
    url: '',
    duration: '1 Semaine'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  
  useEffect(() => {
     const fetchData = async () => {
        try {
           const [prodRes, msgRes, favRes] = await Promise.all([
             fetch('/api/products/my'),
             fetch('/api/messages'),
             fetch('/api/favorites')
           ]);
           if (prodRes.ok) {
              let data = await prodRes.json();
              if (data.length === 0) {
                 data = [
                   { id: "550e8400-e29b-41d4-a716-446655440000", reference_id: "PRD-A45B81", name: "Pompe Centrifuge Industrielle", status: "Actif", price: "Sur devis", views: 120, leads: 5 }
                 ];
              }
              setProducts(data);
           }
           if (msgRes.ok) {
              const data = await msgRes.json();
              setMessages(data);
           }
           if (favRes.ok) {
              let data = await favRes.json();
              if (data.length === 0) {
                 data = [
                   { item_id: "a12b8400-d29b-41d4-a716-446655440333", item_type: "product", name: "Vanne Papillon Motorisée", reference_id: "PRD-5XQPL2" }
                 ];
              }
              setFavorites(data);
           }
        } catch (e) {
           console.error('Erreur API Dashboard:', e);
        }
     };
     if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage })
      });
      
      if (res.ok) {
         const msg = await res.json();
         setMessages(prev => [...prev, msg]);
         setNewMessage('');
         
         // Simulate auto-response
         setIsTyping(true);
         setTimeout(() => {
           setIsTyping(false);
           const response = {
             id: Date.now() + 1,
             sender: 'them',
             text: 'C\'est entendu. Souhaitez-vous que je vous envoie le bon de commande pour signature ?',
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           };
           setMessages(prev => [...prev, response]);
         }, 2000);
      }
    } catch (e) {
       console.error("Erreur envoi message", e);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotify("Le produit a été supprimé.");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
      setSelectedTender(null);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const [tenders, setTenders] = useState<any[]>([]);
  const [tendersLoading, setTendersLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setTendersLoading(true);
        const endpoint = user?.role === 'acheteur' ? '/api/tenders/my' : '/api/tenders';
        const res = await fetch(endpoint);
        if (res.ok) {
          let data = await res.json();
          // Convert to expected UI format
          data = data.map((t: any) => ({
             id: t.id,
             title: t.title,
             date: new Date(t.created_at || t.deadline).toLocaleDateString(),
             bids: Math.floor(Math.random() * 15), // mocked bids
             status: t.status === 'open' ? 'Ouvert' : t.status,
             color: t.status === 'open' ? 'text-secondary' : 'text-gray-400',
             company: t.author?.company
          }));
          
          setTenders(data);
        }
      } catch (err) {
        console.error('Failed to fetch tenders:', err);
      } finally {
        setTendersLoading(false);
      }
    };
    if (isAuthenticated) fetchTenders();
  }, [user, isAuthenticated]);

  const [companyInfo, setCompanyInfo] = useState({
    name: user?.company || '',
    bio: 'Leader national dans la fourniture de solutions industrielles et équipements de pointe.',
    address: 'Zone Industrielle, Rouiba, Alger',
    phone: '021 00 00 00',
    website: 'wwww.entreprise.dz'
  });

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showNotify("Informations entreprise mises à jour.", "success");
    }, 1000);
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [productFileUrl, setProductFileUrl] = useState('');

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setProductFileUrl(data.url);
      }
    } catch(err) {
      console.error(err);
    }
    setUploadingImage(false);
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: formData.get('price') as string,
      description: formData.get('description') as string,
      file_url: productFileUrl,
    };
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const addedProd = await res.json();
        setProducts(prev => [addedProd, ...prev]);
        setShowProductForm(false);
        setProductFileUrl('');
        showNotify("Le produit a été ajouté avec succès au catalogue.", "success");
      } else {
        showNotify("Erreur lors de l'ajout", "error");
      }
    } catch (err) {
      showNotify("Erreur réseau", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const submitTender = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           title: tenderFormData.title,
           description: tenderFormData.description,
           deadline: tenderFormData.deadline,
           category: tenderFormData.sector,
           budget: tenderFormData.budget,
           file_url: tenderFormData.file_url
        }) 
      });
      if (res.ok) {
        const newTender = await res.json();
        setTenders(prev => [newTender, ...prev]);
        setShowTenderForm(false);
        setTenderStep(1);
        setTenderFormData({ title: '', sector: "Énergie & Hydrocarbures", budget: '', description: '', location: "Alger (Rouiba / Dar el Beida)", deadline: '', file_url: '' });
        showNotify("Votre appel d'offre a été soumis avec succès.", "success");
      } else {
        showNotify("Erreur lors de l'ajout", "error");
      }
    } catch (err) {
      showNotify("Erreur réseau", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAd = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adFormData)
      });
      if (res.ok) {
        setShowAdForm(false);
        setAdFormData({ name: '', type: 'Bannière Accueil', url: '', duration: '1 Semaine' });
        showNotify("Votre demande d'espace pub a été envoyée pour validation.", "success");
      } else {
        showNotify("Erreur lors de la soumission", "error");
      }
    } catch (err) {
      showNotify("Erreur réseau", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (id: number | string) => {
    try {
      await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      setFavorites(prev => prev.filter(f => f.id !== id));
      showNotify("Favoris supprimé.");
    } catch (e) {
      console.error(e);
    }
  };

  const [profileInfo, setProfileInfo] = useState({
    name: user?.name || 'Ahmed Saada',
    email: user?.email || 'contact@sonatrach.dz',
    role: 'Directeur des Achats Industriels',
    phone: '+213 21 00 00 00'
  });
  const [chartTimeframe, setChartTimeframe] = useState<'6m' | '1y'>('6m');
  const [apiStats, setApiStats] = useState<any>(null);

  useEffect(() => {
     const fetchStats = async () => {
         try {
            const res = await fetch(`/api/stats/dashboard?timeframe=${chartTimeframe}`);
            if (res.ok) {
                const data = await res.json();
                setApiStats(data);
            }
         } catch(e) {
            console.error('Stats fetch error:', e);
         }
     };
     if (isAuthenticated) fetchStats();
  }, [isAuthenticated, chartTimeframe]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showNotify("Profil mis à jour avec succès.", "success");
    }, 1000);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
    p.cat.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredTenders = tenders.filter(t => 
    t.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    t.status.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const renderContent = () => {
    if (!user) return null;
    switch(activeTab) {
      case 'overview':
        const stats = user.role === 'fournisseur' ? [
          { label: 'Publicités', value: apiStats?.metrics?.ads || 0, trend: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Demandes (Devis)', value: apiStats?.metrics?.rfqs || 0, trend: '+5%', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Produits actifs', value: apiStats?.metrics?.items || 0, trend: 'Stable', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Score visibilité', value: '92%', trend: '+2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
        ] : [
          { label: 'AO lancés', value: apiStats?.metrics?.items || 0, trend: '+2', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Devis Reçus', value: apiStats?.metrics?.rfqs || 0, trend: '+15%', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Économies est.', value: '1.2M DZD', trend: '8%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Messages', value: apiStats?.metrics?.messages || 0, trend: 'Stable', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
        ];

        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div 
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-primary mt-1">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-primary text-lg">
                    {user.role === 'fournisseur' ? 'Performance Visibilité' : 'Engagement Appels d\'Offres'}
                  </h3>
                  <div className="flex bg-gray-50 p-1 rounded-lg">
                    <button 
                      onClick={() => setChartTimeframe('6m')}
                      className={cn("px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all", chartTimeframe === '6m' ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-primary")}
                    >
                      6 mois
                    </button>
                    <button 
                      onClick={() => setChartTimeframe('1y')}
                      className={cn("px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all", chartTimeframe === '1y' ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-primary")}
                    >
                      1 an
                    </button>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={apiStats?.chartData || (user.role === 'fournisseur' ? (chartTimeframe === '1y' ? dataFournisseur1y : dataFournisseur) : (chartTimeframe === '1y' ? dataAcheteur1y : dataAcheteur))}>
                      <defs>
                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={user.role === 'fournisseur' ? "#1B4D2E" : "#d97706"} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={user.role === 'fournisseur' ? "#1B4D2E" : "#d97706"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={user.role === 'fournisseur' ? "views" : "messages"} 
                        stroke={user.role === 'fournisseur' ? "#1B4D2E" : "#d97706"} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorMain)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-primary text-lg mb-6">Activités récentes</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Nouvelle réponse', desc: 'Sarl Mecanique a répondu à votre AO', time: 'Il y a 2h', icon: MessageSquare, color: 'text-blue-600' },
                    { title: 'Paiement reçu', desc: 'Abonnement Premium renouvelé', time: 'Il y a 5h', icon: CreditCard, color: 'text-success' },
                    { title: 'Alerte Produit', desc: 'Votre produit "Pompe X" est en rupture', time: 'Hier', icon: Bell, color: 'text-orange-600' },
                    { title: 'Profil mis à jour', desc: 'Informations de contact modifiées', time: 'Il y a 2 jours', icon: User, color: 'text-purple-600' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className={cn("p-2 rounded-lg bg-gray-50", activity.color)}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.desc}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => showNotify("Redirection vers l'historique complet...", "success")} className="w-full mt-8 py-3 text-sm font-bold text-primary hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center space-x-2">
                  <span>Voir tout</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm max-w-4xl"
          >
            <div className="flex items-center space-x-6 mb-12">
               <div className="relative group">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-primary font-black text-3xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all relative overflow-hidden">
                     {profileInfo.name.charAt(0)}
                     <input 
                       type="file" 
                       accept="image/*"
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       onChange={(e) => {
                         if (e.target.files && e.target.files.length > 0) {
                           showNotify(`Image ${e.target.files[0].name} sélectionnée pour l'avatar`, 'success');
                         }
                       }}
                     />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-secondary text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-all" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                     <Edit2 className="h-3 w-3" />
                  </button>
               </div>
               <div>
                  <h3 className="text-xl font-black text-primary uppercase italic">{profileInfo.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{profileInfo.role}</p>
               </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Nom Complet</label>
                  <input 
                    type="text" 
                    value={profileInfo.name}
                    onChange={(e) => setProfileInfo({...profileInfo, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Email Professionnel</label>
                  <input 
                    type="email" 
                    value={profileInfo.email}
                    onChange={(e) => setProfileInfo({...profileInfo, email: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Poste Occupé</label>
                  <input 
                    type="text" 
                    value={profileInfo.role}
                    onChange={(e) => setProfileInfo({...profileInfo, role: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Téléphone</label>
                  <input 
                    type="tel" 
                    value={profileInfo.phone}
                    onChange={(e) => setProfileInfo({...profileInfo, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm" 
                  />
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                   <h4 className="text-[10px] font-black text-primary uppercase italic mb-1">Sécurité</h4>
                   <button type="button" onClick={() => showNotify("Un email de réinitialisation a été envoyé.", "success")} className="text-[9px] font-black text-secondary hover:underline uppercase tracking-widest">Changer mon mot de passe</button>
                </div>
                <button type="submit" disabled={isLoading} className="bg-primary text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center space-x-2">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Sauvegarder les changements</span>}
                </button>
              </div>
            </form>
          </motion.div>
        );
      case 'messages':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row gap-6 h-[700px]"
          >
            {/* Conversations List */}
            <div className="w-full lg:w-96 bg-white border border-gray-100 rounded-[32px] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Filtrer messages..."
                    className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-gray-100 text-xs font-bold focus:outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {[
                  { name: 'Global Filtration DZ', last: messages.length > 0 ? messages[messages.length-1].text : 'Bonjour, nous sommes intéressés...', time: messages.length > 0 ? messages[messages.length-1].time : '10:42', unread: 2, online: true },
                  { name: 'Mecanique Plus', last: 'Merci pour votre demande.', time: 'Hier', unread: 0, online: false },
                  { name: 'Sonatrach Procurement', last: 'Le dossier est complet.', time: 'Lundi', unread: 0, online: true },
                ].map((msg, i) => (
                  <button 
                    key={i}
                    className={cn(
                      "w-full p-6 text-left flex items-start space-x-4 border-b border-gray-50 transition-all",
                      i === 0 ? "bg-secondary text-white" : "hover:bg-gray-50"
                    )}
                   onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center font-black text-primary">
                        {msg.name.charAt(0)}
                      </div>
                      {msg.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className={cn("text-xs font-black uppercase tracking-tight truncate", i === 0 ? "text-white" : "text-primary")}>{msg.name}</p>
                        <span className={cn("text-[9px] font-bold", i === 0 ? "text-white/60" : "text-gray-400")}>{msg.time}</span>
                      </div>
                      <p className={cn("text-[10px] font-medium truncate", i === 0 ? "text-white/80" : "text-gray-500")}>
                        {msg.last}
                      </p>
                    </div>
                    {msg.unread > 0 && i !== 0 && (
                      <div className="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center text-[9px] font-black">
                        {msg.unread}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-white border border-gray-100 rounded-[32px] overflow-hidden flex flex-col shadow-xl">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center font-black text-secondary">G</div>
                  <div>
                    <h4 className="text-xs font-black text-primary uppercase tracking-tight">Global Filtration DZ</h4>
                    <p className="text-[9px] font-bold text-success uppercase">En ligne maintenant</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => showNotify("Appel audio initié...", "success")} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-all"><Phone className="h-4 w-4" /></button>
                  <button onClick={() => showNotify("Appel vidéo initié...", "success")} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-all"><Video className="h-4 w-4" /></button>
                  <button onClick={() => showNotify("Informations du contact", "success")} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-all"><Info className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-8 bg-gray-50/30">
                <div className="flex justify-center">
                  <span className="text-[9px] font-black text-gray-400 bg-white px-4 py-1 rounded-full border border-gray-100 uppercase tracking-widest">Aujourd'hui, 14:02</span>
                </div>
                
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex space-x-4 max-w-[80%]", m.sender === 'me' ? "flex-row-reverse space-x-reverse ml-auto" : "")}>
                    <div className={cn("w-8 h-8 rounded-lg shrink-0", m.sender === 'me' ? "bg-secondary" : "bg-gray-200")} />
                    <div className={cn(
                      "p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm",
                      m.sender === 'me' ? "bg-primary text-white rounded-tr-none" : "bg-white text-gray-600 rounded-tl-none border border-gray-100"
                    )}>
                      {m.text}
                      {m.file && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between group cursor-pointer hover:border-secondary transition-all">
                           <div className="flex items-center space-x-3 text-primary">
                              <FileText className="h-4 w-4 text-secondary" />
                              <span className="text-[10px] font-black uppercase">{m.file}</span>
                           </div>
                           <ArrowUpRight className="h-3 w-3 text-gray-400 group-hover:text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                      )}
                      <p className={cn("text-[8px] font-bold mt-2 uppercase opacity-40", m.sender === 'me' ? "text-right" : "")}>{m.time}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex space-x-4 max-w-[80%]">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-gray-100 flex space-x-1">
                       <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" />
                       <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                       <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-gray-100">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-secondary transition-all"
                >
                  <button type="button" onClick={() => showNotify("Joindre un devis ou dossier technique...", "success")} className="p-3 text-gray-400 hover:text-secondary transition-colors"><Zap className="h-5 w-5" /></button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire votre message..."
                    className="flex-1 bg-transparent px-2 py-3 text-xs font-bold outline-none"
                  />
                  <button 
                    type="submit"
                    className="p-4 bg-primary text-white rounded-xl hover:bg-secondary transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {[
              { id: 1, title: 'Offre reçue', desc: 'Sarl Algeria Tech a soumis une offre pour votre RFQ.', time: 'Il y a 10 min', type: 'offer' },
              { id: 2, title: 'Certification validée', desc: 'Votre compte est désormais certifié "Fournisseur Premium".', time: 'Il y a 1h', type: 'system' },
              { id: 3, title: 'Message de Global Filtration', desc: 'Vous avez un nouveau message non lu.', time: 'Hier', type: 'message' },
              { id: 4, title: 'Maintenance plateforme', desc: 'Une maintenance est prévue ce dimanche à 02:00.', time: 'Il y a 2 jours', type: 'alert' }
            ].map((notif) => (
              <div key={notif.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between hover:border-secondary transition-all group">
                <div className="flex items-center space-x-6">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                     notif.type === 'offer' ? "bg-emerald-50 text-emerald-600" :
                     notif.type === 'alert' ? "bg-red-50 text-red-600" :
                     notif.type === 'message' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                   )}>
                     <Bell className="h-5 w-5" />
                   </div>
                   <div>
                     <h4 className="text-sm font-black text-primary uppercase italic">{notif.title}</h4>
                     <p className="text-xs text-gray-500 font-medium">{notif.desc}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.time}</p>
                </div>
              </div>
            ))}
          </motion.div>
        );
      case 'tenders':
        if (selectedTender) {
          return (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                 <button 
                  onClick={() => setSelectedTender(null)}
                  className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all"
                 >
                   <X className="h-4 w-4" />
                 </button>
                 <h3 className="text-xl font-bold text-primary italic uppercase tracking-tight">Détails du RFQ</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-black text-secondary bg-secondary/10 px-4 py-1 rounded-full uppercase tracking-widest">{selectedTender.status}</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PUBLIÉ LE {selectedTender.date}</span>
                    </div>
                    <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter mb-6">{selectedTender.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-10">
                      Nous recherchons un partenaire certifié pour la maintenance préventive et curative de 4 transformateurs de 20kV. 
                      Le projet inclut l'inspection visuelle, le test diélectrique de l'huile, la vérification des accessoires de protection (DGPT2) 
                      et le nettoyage complet des bornes haute tension.
                    </p>
                    <div className="grid grid-cols-2 gap-6 p-8 bg-gray-50 rounded-[32px]">
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Localisation</p>
                          <p className="text-[11px] font-black text-primary uppercase tracking-tight">Zone Industrielle Rouiba</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget Estimé</p>
                          <p className="text-[11px] font-black text-primary uppercase tracking-tight">Confidentiel</p>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] border border-gray-100">
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-6">Offres reçues ({selectedTender.bids})</h4>
                    <div className="space-y-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-secondary transition-all">
                            <div className="flex items-center space-x-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><Building2 className="h-5 w-5" /></div>
                               <div>
                                  <p className="text-xs font-black text-primary uppercase">Candidat #{i*242}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">Soumis il y a {i}h</p>
                               </div>
                            </div>
                            <button onClick={() => showNotify("Détails de l'offre ouverts dans une nouvelle fenêtre", "success")} className="text-[9px] font-black text-secondary uppercase tracking-widest hover:underline">Voir l'offre</button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-primary p-8 rounded-[40px] text-white">
                      <h4 className="text-[11px] font-black uppercase tracking-widest mb-6 opacity-40">Actions</h4>
                      <div className="space-y-3">
                         <button onClick={() => showNotify("Accès au dossier candidat complet...", "success")} className="w-full py-4 bg-white text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">Consulter Dossier</button>
                         <button onClick={() => showNotify("Téléchargement PDF en cours...", "success")} className="w-full py-4 bg-primary border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Télécharger PDF</button>
                      </div>
                      <div className="mt-8 pt-8 border-t border-white/10">
                         <p className="text-[9px] font-bold text-white/50 uppercase leading-relaxed italic">Date limite de soumission: 25 Mai 2026 à 17:00</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        }
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-bold text-primary italic uppercase tracking-tight">Appels d'Offres & RFQ</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Suivi de vos demandes et opportunités</p>
               </div>
               {user.role === 'acheteur' && (
                 <button onClick={() => setShowTenderForm(true)} className="btn-primary py-3 px-6 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                   <Plus className="h-4 w-4" />
                   <span>Lancer un RFQ</span>
                 </button>
               )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {tendersLoading ? (
                 <div className="bg-white p-10 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-secondary animate-spin mb-4" />
                    <span className="text-[10px] font-black uppercase text-gray-400">Chargement de vos données...</span>
                 </div>
              ) : (
                <>
                  {filteredTenders.map((t) => (
                    <div key={t.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between hover:border-secondary transition-all group">
                       <div className="flex items-center space-x-6">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-primary uppercase italic">{t.title}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.reference_id ? `REF: ${t.reference_id}` : `ID: ${t.id.substring(0, 8)}`}</span>
                               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Publié le: {t.date}</span>
                               <span className="text-[9px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-2 py-0.5 rounded-full">{t.bids} OFFRES</span>
                            </div>
                          </div>
                       </div>
                       <div className="flex items-center space-x-6">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full", t.status === 'Ouvert' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                            {t.status}
                          </span>
                          <button 
                            onClick={() => setSelectedTender(t)}
                            className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-all"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                  ))}
                  {filteredTenders.length === 0 && (
                    <div className="py-20 text-center opacity-50">
                      <Search className="h-10 w-10 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        {globalSearch ? `Aucun résultat pour "${globalSearch}"` : "Aucun appel d'offre"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        );
      case 'products':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-xl font-bold text-primary italic uppercase tracking-tight">Gestion du Catalogue</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gérez vos produits référencés sur le portail</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex bg-white border border-gray-100 p-1 rounded-xl">
                   {['Tous', 'Actif', 'Rupture'].map(f => (
                     <button key={f} onClick={() => showNotify(`Filtre ${f} appliqué`, "success")} className={cn("px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg transition-all", f === 'Tous' ? "bg-primary text-white" : "text-gray-400 hover:text-primary")}>{f}</button>
                   ))}
                </div>
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="btn-primary py-3 px-6 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter un produit</span>
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produit / SKU</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Gamme de Prix</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><Package className="h-5 w-5" /></div>
                            <div>
                               <p className="text-xs font-black text-primary uppercase tracking-tight">{p.name}</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase">{p.reference_id ? `REF: ${p.reference_id}` : `ID: ${p.id.substring(0, 8)}`}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.cat}</td>
                      <td className="px-8 py-6 text-[11px] font-black italic text-primary">{p.price}</td>
                      <td className="px-8 py-6">
                        <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest", p.status === 'Actif' ? "bg-emerald-50 text-success" : "bg-red-50 text-red-500")}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                           <button onClick={() => showNotify("Ouverture de l'éditeur...", "success")} className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all"><Edit2 className="h-4 w-4" /></button>
                           <button 
                             onClick={() => deleteProduct(p.id)}
                             className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                         <div className="opacity-20 mb-4"><Package className="h-12 w-12 mx-auto" /></div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{globalSearch ? `Aucun résultat pour "${globalSearch}"` : 'Aucun produit dans votre catalogue'}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      case 'favorites':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    {fav.item_type === 'product' && fav.image ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                         <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        {fav.item_type === 'product' ? <Package className="h-7 w-7" /> : <Building2 className="h-7 w-7" />}
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-black text-primary uppercase italic">{fav.name || `Favori (${fav.reference_id || fav.item_id.substring(0,8)})`}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{fav.category || fav.item_type}</p>
                      <p className="text-[9px] font-mono text-gray-400 uppercase mt-1 tracking-widest">
                         {fav.reference_id ? `REF: ${fav.reference_id}` : `ID: ${fav.item_id.substring(0,8)}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFavorite(fav.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0 ml-4"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex items-center space-x-2 text-gray-500">
                      <span className="text-[10px] font-bold uppercase">{fav.location || 'Alger'}</span>
                   </div>
                   <Link 
                    to={fav.item_type === 'product' ? `/products/${fav.item_id}` : `/company/${fav.item_id}`}
                    className="text-[10px] font-black text-secondary hover:underline uppercase tracking-widest flex items-center space-x-1"
                   >
                     <span>{fav.item_type === 'product' ? 'Voir produit' : 'Voir profil'}</span>
                     <ChevronRight className="h-3 w-3" />
                   </Link>
                </div>
              </div>
            ))}
            {favorites.length === 0 && (
              <div className="col-span-full py-32 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Heart className="h-10 w-10" />
                 </div>
                 <h4 className="text-xl font-black text-primary uppercase italic mb-2">Aucun favoris</h4>
                 <p className="text-sm text-gray-500">Explorez le catalogue pour ajouter des produits à vos favoris.</p>
              </div>
            )}
          </motion.div>
        );
      case 'ads':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div>
                <h3 className="text-2xl font-black text-primary uppercase italic">Espace Publicitaire</h3>
                <p className="text-gray-500 mt-2">Gérez vos campagnes et maximisez votre visibilité sur la plateforme.</p>
              </div>
              <button 
                onClick={() => setShowAdForm(true)}
                className="bg-secondary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Demander un espace pub</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h4 className="font-bold text-primary text-lg">Vos campagnes actives</h4>
                <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-200">
                   <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <Zap className="h-8 w-8 text-gray-400" />
                   </div>
                   <h5 className="font-bold text-gray-900 mb-2">Aucune campagne en cours</h5>
                   <p className="text-sm text-gray-500">Vous n'avez pas de publicité active actuellement.</p>
                </div>
               
                <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl mt-4">
                   <h5 className="font-bold text-primary mb-2">Pourquoi annoncer ici ?</h5>
                   <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Atteignez plus de 10 000 professionnels ciblés</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Augmentez vos chances de remporter des AO</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Bannières affichées en page d'accueil et annuaire</li>
                   </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                 <h4 className="font-bold text-primary text-lg">Statistiques</h4>
                 <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                       <span className="text-sm text-gray-500 font-bold">Vues (30j)</span>
                       <span className="font-black text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                       <span className="text-sm text-gray-500 font-bold">Clics (30j)</span>
                       <span className="font-black text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-500 font-bold">CTR</span>
                       <span className="font-black text-primary">0.0%</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        );

      case 'subscription':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-primary p-12 rounded-[48px] text-white overflow-hidden relative">
               <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Plan Actuel</span>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter mt-4 mb-2">Fournisseur Premium</h3>
                  <p className="text-white/60 font-medium">Valide jusqu'au 16 Mai 2027</p>
                  <div className="mt-10 flex space-x-4">
                     <button onClick={() => showNotify("Redirection vers Stripe Checkout...", "success")} className="bg-white text-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">Gérer l'abonnement</button>
                     <button onClick={() => showNotify("Téléchargement de la facture...", "success")} className="bg-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20">Voir facture</button>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
               <div className="absolute bottom-0 right-20 w-40 h-40 bg-secondary/20 rounded-full translate-y-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { 
                   name: 'Gratuit', 
                   price: '0 DZD', 
                   features: ['Visibilité de base', '3 RFQ par mois', 'Messagerie limitée', 'Support standard'],
                   active: false
                 },
                 { 
                   name: 'Premium', 
                   price: '4,500 DZD', 
                   period: '/mois',
                   features: ['Badge "Vérifié"', 'RFQ illimités', 'Mise en avant catalogue', 'Conseiller dédié', 'Statistiques avancées'],
                   active: true
                 }
               ].map((plan) => (
                 <div key={plan.name} className={cn(
                   "p-10 rounded-[40px] border transition-all",
                   plan.active ? "border-secondary bg-white shadow-xl scale-[1.02]" : "border-gray-100 bg-white"
                 )}>
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <h4 className="text-xl font-black text-primary uppercase italic">{plan.name}</h4>
                          <div className="flex items-baseline mt-2">
                             <span className="text-2xl font-black text-primary">{plan.price}</span>
                             <span className="text-xs font-bold text-gray-400 ml-1">{plan.period}</span>
                          </div>
                       </div>
                       {plan.active && <div className="p-2 bg-secondary text-white rounded-xl shadow-lg"><CheckCircle className="h-5 w-5" /></div>}
                    </div>
                    <ul className="space-y-4 mb-10">
                       {plan.features.map(f => (
                         <li key={f} className="flex items-center space-x-3 text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                            <CheckCircle className={cn("h-4 w-4", plan.active ? "text-secondary" : "text-gray-300")} />
                            <span>{f}</span>
                         </li>
                       ))}
                    </ul>
                    {!plan.active && (
                       <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>Plan actuel</button>
                    )}
                 </div>
               ))}
            </div>
          </motion.div>
        );
      case 'stats':
        return (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                   <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-8 italic">Répartition des clics</h4>
                   <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-full border border-gray-100 max-w-[300px] mx-auto relative group">
                      <div className="text-center">
                         <p className="text-4xl font-black text-primary">562</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Total clics</p>
                      </div>
                      <div className="absolute inset-0 border-[20px] border-secondary border-t-transparent border-r-transparent rounded-full" />
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-center">
                   <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-8 italic">Top Catégories consultées</h4>
                   {['Hydraulique', 'Mécanique', 'Énergie', 'BTP'].map((cat, i) => (
                      <div key={cat} className="mb-6 last:mb-0">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-black text-primary uppercase italic">{cat}</span>
                           <span className="text-[10px] font-bold text-gray-400">{80 - (i*15)}%</span>
                         </div>
                         <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${80 - (i*15)}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full bg-secondary"
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        );
      case 'company':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl"
          >
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="h-32 bg-primary relative">
                  <div className="absolute -bottom-10 left-10 w-24 h-24 bg-white rounded-[24px] border-4 border-white shadow-xl flex items-center justify-center group overflow-hidden">
                     <Building2 className="h-10 w-10 text-primary group-hover:opacity-0 transition-opacity" />
                     <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="h-6 w-6 text-white" />
                     </div>
                     <input 
                       type="file" 
                       accept="image/*"
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       onChange={(e) => {
                         if (e.target.files && e.target.files.length > 0) {
                           showNotify(`Image ${e.target.files[0].name} sélectionnée pour le logo Mettre à jour la fiche.`, 'success');
                         }
                       }}
                     />
                  </div>
               </div>
               <form onSubmit={handleUpdateCompany} className="p-12 pt-20 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Nom de l'entreprise</label>
                        <input 
                          type="text" 
                          value={companyInfo.name}
                          onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Site Web</label>
                        <input 
                          type="text" 
                          value={companyInfo.website}
                          onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Biographie / Description</label>
                     <textarea 
                        rows={4}
                        value={companyInfo.bio}
                        onChange={(e) => setCompanyInfo({...companyInfo, bio: e.target.value})}
                        className="w-full bg-gray-50 border-none px-8 py-6 rounded-3xl text-sm font-medium outline-none resize-none" 
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Adresse Siège</label>
                        <input 
                          type="text" 
                          value={companyInfo.address}
                          onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Téléphone Professionnel</label>
                        <input 
                          type="text" 
                          value={companyInfo.phone}
                          onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none" 
                        />
                     </div>
                  </div>
                  <div className="pt-4">
                     <button type="submit" disabled={isLoading} className="bg-primary text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center space-x-2">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span>Mettre à jour la fiche</span>
                     </button>
                  </div>
               </form>
            </div>
          </motion.div>
        );
    }
  };

  const menuItems = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'profile', name: 'Mon Profil', icon: User },
    { id: 'messages', name: 'Messagerie', icon: MessageSquare },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'products', name: 'Mes Produits', icon: Package, roles: ['fournisseur'] },
    { id: 'tenders', name: user?.role === 'acheteur' ? 'Mes Appels d\'offres' : 'Opportunités AO', icon: FileText },
    { id: 'company', name: 'Ma Fiche Entreprise', icon: Building2, roles: ['fournisseur'] },
    { id: 'favorites', name: 'Favoris', icon: Heart, roles: ['acheteur'] },
    { id: 'ads', name: 'Publicité', icon: Zap },
    { id: 'subscription', name: 'Abonnement', icon: CreditCard },
    { id: 'stats', name: 'Statistiques', icon: BarChart3 },
    { id: 'admin', name: 'Console Pro', icon: ShieldCheck, isExternal: true, roles: ['admin'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-neutral-bg flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-6">
          <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-2xl mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary truncate">{user?.company}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const path = item.id === 'admin' ? '/extranet' : 
                          item.id === 'subscription' ? '/subscriptions' :
                          item.id === 'overview' ? '/dashboard' : 
                          `/dashboard?tab=${item.id}`;

              return (
                <Link
                  key={item.id}
                  to={path}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-secondary"
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">Tableau de Bord</h1>
              <p className="text-sm text-gray-500">Bienvenue, {user?.name}. Voici un résumé de votre activité.</p>
            </div>
            
            <div className="flex-1 max-w-md hidden xl:block">
               <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                  <input 
                    type="text" 
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Filtrer partout (produits, RFQ, entreprises...)"
                    className="w-full bg-white border border-gray-100 px-16 py-4 rounded-[32px] text-xs font-bold outline-none focus:border-secondary focus:shadow-xl focus:shadow-secondary/5 transition-all"
                  />
               </div>
            </div>

            <div className="flex items-center space-x-3">
              {user?.role === 'fournisseur' && (
                <Link to="/subscriptions" className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 hover:bg-success/20 transition-all">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  <span>Abonnement Premium Actif</span>
                </Link>
              )}
              {user?.role === 'acheteur' ? (
                <button onClick={() => setShowTenderForm(true)} className="btn-primary py-2 px-4 text-sm flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouveau RFQ</span>
                </button>
              ) : (
                <button onClick={() => setShowProductForm(true)} className="btn-primary py-2 px-4 text-sm flex items-center space-x-2">
                   <Plus className="h-4 w-4" />
                   <span>Ajouter Produit</span>
                </button>
              )}
            </div>
          </div>

          {!user?.isVerified && (user?.role === 'fournisseur' || user?.role === 'exposant') && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className={`mb-8 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  user?.companyStatus === 'pending' ? 'bg-blue-50 border border-blue-200' : 'bg-orange-50 border border-orange-200'
               }`}
            >
               <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-white rounded-2xl shadow-sm shrink-0 ${
                     user?.companyStatus === 'pending' ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                     {user?.companyStatus === 'pending' ? <Building2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                  </div>
                  <div>
                     <h3 className="font-black text-primary uppercase text-sm mt-1">
                       {user?.companyStatus === 'pending' ? 'Vérification en cours' : 'Vérification de Profil Requise (KYC)'}
                     </h3>
                     <p className="text-xs text-gray-600 mt-1">
                       {user?.companyStatus === 'pending' 
                        ? 'Vos documents légaux ont été transmis et sont actuellement en cours de vérification par nos équipes. Vous serez notifié dès que votre compte sera validé.' 
                        : 'Votre entreprise n\'est pas encore vérifiée. Vous devez soumettre vos documents légaux pour débloquer toutes les fonctionnalités et publier au catalogue.'}
                     </p>
                  </div>
               </div>
               {user?.companyStatus !== 'pending' && (
                  <Link to="/kyc-upload" className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all whitespace-nowrap shadow-lg shadow-primary/20 shrink-0">
                     Transmettre mes documents
                  </Link>
               )}
            </motion.div>
          )}

          {/* Main View Area */}
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showProductForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Nouveau Produit</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Référencement au catalogue</p>
                  </div>
                  <button onClick={() => setShowProductForm(false)} className="p-3 text-gray-400 hover:text-primary transition-all">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={addProduct} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Nom du Produit</label>
                    <input 
                      name="name"
                      required
                      type="text" 
                      placeholder="Ex: Pompe à engrenages HP-300" 
                      className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-secondary/20 transition-all" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Catégorie</label>
                      <select name="category" className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none">
                        <option>Hydraulique</option>
                        <option>Énergie</option>
                        <option>Pneumatique</option>
                        <option>Outillage</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Gamme de Prix (DZD)</label>
                      <input name="price" required type="text" placeholder="Ex: 50,000" className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-sm font-bold outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Description Technique</label>
                    <textarea 
                      rows={4} 
                      placeholder="Spécifications, dimensions, usage..." 
                      className="w-full bg-gray-50 border-none px-8 py-6 rounded-3xl text-sm font-medium outline-none resize-none" 
                    />
                  </div>

                  <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center relative cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleProductImageUpload} disabled={uploadingImage} />
                    {uploadingImage ? (
                      <Loader2 className="h-6 w-6 text-primary mx-auto mb-2 animate-spin" />
                    ) : productFileUrl ? (
                      <div className="text-secondary font-black text-sm uppercase tracking-widest break-all">Fichier Ajouté: {productFileUrl.split('-').pop()}</div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Images ou Fiche Technique (PDF)</p>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center space-x-3"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Ajouter au catalogue</span>}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-8 border border-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tender Form Modal */}
      <AnimatePresence>
        {showTenderForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-[80vh]">
                <div className="w-80 bg-gray-50 p-10 border-r border-gray-100 hidden md:block">
                  <div className="mb-8">
                     <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Nouveau RFQ</h3>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Appel d'Offres Industriel</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { step: 1, label: 'Détails de base', icon: Info },
                      { step: 2, label: 'Spécifications', icon: Zap },
                      { step: 3, label: 'Logistique', icon: Package },
                      { step: 4, label: 'Publication', icon: CheckCircle },
                    ].map((s) => (
                      <div 
                        key={s.step} 
                        className={cn(
                          "flex items-center space-x-4 p-4 rounded-2xl transition-all",
                          tenderStep === s.step ? "bg-white shadow-sm border border-gray-100" : "opacity-40"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          tenderStep >= s.step ? "bg-secondary text-white" : "bg-gray-200 text-gray-400"
                        )}>
                          <s.icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto p-6 bg-primary rounded-3xl text-white mt-12">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                        Chaque appel d'offre est modéré sous 24h par nos experts industriels.
                     </p>
                  </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto no-scrollbar flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Étape {tenderStep} / 4</span>
                    <button onClick={() => setShowTenderForm(false)} className="p-2 text-gray-400 hover:text-primary transition-all">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <AnimatePresence mode="wait">
                      {tenderStep === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Titre du Projet</label>
                            <input 
                              type="text" 
                              value={tenderFormData.title}
                              onChange={e => setTenderFormData({...tenderFormData, title: e.target.value})}
                              placeholder="Ex: Fourniture de câbles armés 20kV..." 
                              className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-secondary/20 transition-all" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Secteur d'activité</label>
                              <select 
                                value={tenderFormData.sector}
                                onChange={e => setTenderFormData({...tenderFormData, sector: e.target.value})}
                                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none">
                                <option>Énergie & Hydrocarbures</option>
                                <option>Construction & BTP</option>
                                <option>Automobile & Mécanique</option>
                                <option>Agro-alimentaire</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Budget estimé (DZD)</label>
                              <input 
                                type="text" 
                                value={tenderFormData.budget}
                                onChange={e => setTenderFormData({...tenderFormData, budget: e.target.value})}
                                placeholder="Ex: 5,000,000" 
                                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-sm font-bold outline-none" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {tenderStep === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Description détaillée</label>
                            <textarea 
                              rows={6} 
                              value={tenderFormData.description}
                              onChange={e => setTenderFormData({...tenderFormData, description: e.target.value})}
                              placeholder="Détaillez vos besoins techniques..." 
                              className="w-full bg-gray-50 border-none px-8 py-6 rounded-3xl text-sm font-medium outline-none resize-none" 
                            />
                          </div>
                          <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                             <Upload className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joindre cahier des charges (PDF/Excel)</p>
                          </div>
                        </motion.div>
                      )}

                      {tenderStep === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                           <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Lieu de livraison / Service</label>
                              <select 
                                value={tenderFormData.location}
                                onChange={e => setTenderFormData({...tenderFormData, location: e.target.value})}
                                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none">
                                <option>Alger (Rouiba / Dar el Beida)</option>
                                <option>Oran (Arzew / Bethioua)</option>
                                <option>Sétif (Zone Industrielle)</option>
                                <option>Hassi Messaoud</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Date limite de réponse</label>
                              <input 
                                type="date" 
                                value={tenderFormData.deadline}
                                onChange={e => setTenderFormData({...tenderFormData, deadline: e.target.value})}
                                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-xs font-bold outline-none" />
                            </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Critères de sélection</label>
                             <div className="grid grid-cols-2 gap-4">
                                {['Prix compétitif', 'Délais courts', 'Certification ISO', 'Service local'].map(c => (
                                  <label key={c} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                                     <input type="checkbox" className="w-4 h-4 rounded text-secondary" />
                                     <span className="text-[10px] font-bold text-gray-600 uppercase">{c}</span>
                                  </label>
                                ))}
                             </div>
                          </div>

                          <div className="pt-4 border-t border-gray-50 space-y-2 mt-6">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Cahier des charges détaillé (PDF)</label>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center relative cursor-pointer hover:bg-gray-100 transition-colors">
                              <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleTenderFileUpload} disabled={uploadingTenderFile} />
                              {uploadingTenderFile ? (
                                <Loader2 className="h-6 w-6 text-primary mx-auto mb-2 animate-spin" />
                              ) : tenderFormData.file_url ? (
                                <div className="text-secondary font-black text-sm uppercase tracking-widest break-all">Fichier Ajouté: {tenderFormData.file_url.split('-').pop()}</div>
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joindre le cahier des charges</p>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {tenderStep === 4 && (
                        <motion.div 
                          key="step4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-10"
                        >
                           <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                              <ShieldCheck className="h-10 w-10 text-secondary" />
                           </div>
                           <h4 className="text-2xl font-black text-primary uppercase tracking-tighter mb-4 italic">Prêt à publier ?</h4>
                           <p className="text-sm text-gray-500 max-w-sm mx-auto mb-10">Votre appel d'offre sera transmis aux fournisseurs correspondants à vos critères une fois validé par nos services.</p>
                           <div className="bg-gray-50 p-6 rounded-3xl text-left mb-10">
                              <div className="flex justify-between mb-4">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase italic">Titre:</span>
                                 <span className="text-[10px] font-black text-primary uppercase italic">Fourniture de câbles armés...</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase italic">Lieu:</span>
                                 <span className="text-[10px] font-black text-primary uppercase italic">Alger (Rouiba)</span>
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    {tenderStep > 1 && (
                      <button 
                        onClick={() => setTenderStep(prev => prev - 1)}
                        className="px-8 border border-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all"
                      >
                        Retour
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (tenderStep < 4) {
                          setTenderStep(prev => prev + 1);
                        } else {
                          submitTender();
                        }
                      }}
                      className="flex-1 bg-secondary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>{tenderStep === 4 ? 'Publier le RFQ' : 'Étape suivante'}</span>
                          {tenderStep < 4 && <ChevronRight className="h-4 w-4" />}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Ad Space Request Form Modal */}
      <AnimatePresence>
        {showAdForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white max-w-2xl w-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-primary uppercase italic mb-2">Demande d'Espace Pub</h2>
                    <p className="text-gray-500 font-medium">Bostez votre visibilité auprès des professionnels de l'industrie.</p>
                  </div>
                  <button 
                    onClick={() => setShowAdForm(false)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Nom de la campagne</label>
                    <input 
                      type="text" 
                      value={adFormData.name}
                      onChange={e => setAdFormData({...adFormData, name: e.target.value})}
                      placeholder="Ex: Lancement produit 2026"
                      className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Type d'emplacement</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200 cursor-pointer transition-all">
                        <div className="flex items-center space-x-3 mb-2">
                          <input 
                            type="radio" 
                            name="ad_type" 
                            checked={adFormData.type === 'Bannière Accueil'}
                            onChange={() => setAdFormData({...adFormData, type: 'Bannière Accueil'})}
                            className="text-secondary" 
                          />
                          <span className="text-sm font-bold text-primary">Bannière Accueil</span>
                        </div>
                        <span className="text-[10px] text-gray-500 ml-7">Visibilité maximale sur la première page</span>
                      </label>
                      <label className="flex flex-col p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200 cursor-pointer transition-all">
                        <div className="flex items-center space-x-3 mb-2">
                          <input 
                            type="radio" 
                            name="ad_type" 
                            checked={adFormData.type === 'Encart Annuaire'}
                            onChange={() => setAdFormData({...adFormData, type: 'Encart Annuaire'})}
                            className="text-secondary" 
                          />
                          <span className="text-sm font-bold text-primary">Encart Annuaire</span>
                        </div>
                        <span className="text-[10px] text-gray-500 ml-7">Ciblage précis lors des recherches B2B</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Visuel de la bannière</label>
                    <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-10 hover:border-secondary transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 group relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            showNotify(`Image ${e.target.files[0].name} sélectionnée`, 'success');
                          }
                        }}
                      />
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-secondary mb-3 transition-colors" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                          <span className="relative cursor-pointer rounded-md font-bold text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 hover:text-secondary">
                            <span>Télécharger un fichier</span>
                          </span>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500 mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
                        <p className="text-xs leading-5 text-gray-500">Dimensions recommandées : 1200x300px</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">URL de redirection (Optionnel)</label>
                    <input 
                      type="url" 
                      value={adFormData.url}
                      onChange={e => setAdFormData({...adFormData, url: e.target.value})}
                      placeholder="https://votre-site.com/produit"
                      className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Durée souhaitée</label>
                    <select 
                      value={adFormData.duration}
                      onChange={e => setAdFormData({...adFormData, duration: e.target.value})}
                      className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none">
                      <option>1 Semaine</option>
                      <option>1 Mois</option>
                      <option>3 Mois</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                    <button 
                      onClick={() => setShowAdForm(false)}
                      className="px-8 py-4 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={submitAd}
                      className="bg-secondary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span>Soumettre la demande</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Notification Feedback */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={cn(
              "fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-[101] flex items-center space-x-4 border",
              notification.type === 'success' ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
            )}
          >
            {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

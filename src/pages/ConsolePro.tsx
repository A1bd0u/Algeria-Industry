import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Edit2,
  Eye,
  FileText,
  Filter,
  Globe,
  History,
  LayoutDashboard,
  LayoutList,
  Lock,
  MessageSquare,
  Monitor,
  MoreVertical,
  MousePointer,
  Newspaper,
  PackagePlus,
  Plus,
  Settings,
  ShieldCheck,
  Trash,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';
import { useTracking } from '../context/TrackingContext';
import { cn } from '../lib/utils';



const ConsolePro = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { profile, visits, events, totalTimeSpentSec, clearLogs } = useTracking();
  const [activeTab, setActiveTab] = useState('gov-overview');
  const [chartTimeframe, setChartTimeframe] = useState<'6m' | '1y'>('6m');
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [pendingKYC, setPendingKYC] = useState<any[]>([]);
  const [approvedKYC, setApprovedKYC] = useState<string[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const res = await fetch('/api/kyc');
        if (res.ok) {
           const data = await res.json();
           setPendingKYC(data);
        }
      } catch (e) {
        console.error('Error fetching KYC:', e);
      }
    };
    fetchKyc();
  }, []);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApproveKYC = async (id: string, name: string) => {
    try {
      await fetch(`/api/kyc/${id}/approve`, { method: 'POST' });
      setPendingKYC(prev => prev.filter(c => c.id !== id));
      setApprovedKYC(prev => [...prev, id]);
      setNotification({ message: `L'entreprise ${name} a été validée avec succès.`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
       console.error(e);
    }
  };

  const handleRejectKYC = async (id: string, name: string) => {
    try {
      await fetch(`/api/kyc/${id}/reject`, { method: 'POST' });
      setPendingKYC(prev => prev.filter(c => c.id !== id));
      setNotification({ message: `La demande de ${name} a été rejetée.`, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
       console.error(e);
    }
  };

  const statsAdmin = [
    { label: 'Utilisateurs Plateforme', value: '8,432', trend: '+12% ce mois', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Flux d\'Affaires Estimé', value: '45.2M DZD', trend: '+8.4%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Taux de Conversion Pro', value: '18.5%', trend: '+2.1%', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Satisfaction B2B', value: '4.8/5', trend: 'Excellent', icon: ShieldCheck, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const revenueData = [
    { period: 'Jan', revenue: 420000 },
    { period: 'Fév', revenue: 580000 },
    { period: 'Mar', revenue: 710000 },
    { period: 'Avr', revenue: 1250000 },
    { period: 'Mai', revenue: 1800000 },
    { period: 'Juin', revenue: 2400000 },
  ];



  const renderContent = () => {
    switch(activeTab) {
      case 'gov-roles':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="flex justify-between items-end mb-8">
               <div>
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Rôles & Permissions</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Définissez les niveaux d'accès pour votre équipe interne</p>
               </div>
               <button onClick={() => showNotify("Création de rôle...", "success")} className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouveau Rôle</span>
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { role: 'Super Admin', users: 2, access: 'Total', color: 'bg-primary' },
                 { role: 'Modérateur Content', users: 5, access: 'Catalogue & Articles', color: 'bg-emerald-500' },
                 { role: 'Agent Support', users: 3, access: 'Tickets & Messages', color: 'bg-blue-500' },
                 { role: 'Analyste Data', users: 1, access: 'Indicateurs & Stats', color: 'bg-orange-500' },
               ].map((role, i) => (
                 <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-secondary transition-all">
                    <div className="flex items-center justify-between mb-6">
                       <div className={cn("px-4 py-2 rounded-xl text-[9px] font-black text-white uppercase tracking-widest", role.color)}>{role.role}</div>
                       <Settings className="h-4 w-4 text-gray-200 group-hover:text-secondary transition-all" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-gray-400 uppercase">Accès :</span>
                          <span className="font-black text-primary uppercase">{role.access}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-gray-400 uppercase">Utilisateurs :</span>
                          <span className="font-black text-primary">{role.users} Membres</span>
                       </div>
                    </div>
                    <button onClick={() => showNotify("Redirection vers la matrice des droits d'accès", "success")} className="w-full mt-6 py-3 bg-gray-50 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Configurer les droits</button>
                 </div>
               ))}
            </div>
          </motion.div>
        );

      case 'gov-analytics':
        const wilayaData = chartTimeframe === '6m' ? [
          { name: 'Alger (16)', value: 4500, color: '#1B4D2E' },
          { name: 'Oran (31)', value: 2800, color: '#0EA5E9' },
          { name: 'Sétif (19)', value: 2100, color: '#F59E0B' },
          { name: 'Hassi Messaoud (30)', value: 1900, color: '#8B5CF6' },
          { name: 'Blida (09)', value: 1400, color: '#F43F5E' },
        ] : [
          { name: 'Alger (16)', value: 8500, color: '#1B4D2E' },
          { name: 'Oran (31)', value: 4800, color: '#0EA5E9' },
          { name: 'Sétif (19)', value: 3100, color: '#F59E0B' },
          { name: 'Hassi Messaoud (30)', value: 3000, color: '#8B5CF6' },
          { name: 'Blida (09)', value: 2400, color: '#F43F5E' },
        ];
        
        const termsData = chartTimeframe === '6m' ? [
          { term: 'Turbine', volume: 850 },
          { term: 'Acier', volume: 620 },
          { term: 'Solaire', volume: 540 },
          { term: 'HSE', volume: 480 },
          { term: 'Valves', volume: 390 },
        ] : [
          { term: 'Turbine', volume: 1650 },
          { term: 'Acier', volume: 1420 },
          { term: 'Solaire', volume: 1140 },
          { term: 'HSE', volume: 980 },
          { term: 'Valves', volume: 890 },
        ];

        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-primary uppercase italic px-4">Synthèse Analytique</h3>
                <div className="flex bg-gray-50 p-1 rounded-lg">
                  <button 
                    onClick={() => setChartTimeframe('6m')}
                    className={cn("px-4 py-2 rounded-md text-[10px] font-black uppercase transition-all", chartTimeframe === '6m' ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-primary")}
                  >
                    6 mois
                  </button>
                  <button 
                    onClick={() => setChartTimeframe('1y')}
                    className={cn("px-4 py-2 rounded-md text-[10px] font-black uppercase transition-all", chartTimeframe === '1y' ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-primary")}
                  >
                    1 an
                  </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-md p-8 rounded-[40px] border border-white shadow-sm font-sans text-primary">
                <h3 className="text-xs font-black uppercase tracking-widest mb-8 italic">Intensité par Wilaya (Top 5)</h3>
                <div className="space-y-6">
                  {wilayaData.map((wilaya, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black uppercase">{wilaya.name}</span>
                        <span className="text-[10px] font-bold text-gray-400">{(wilaya.value / (chartTimeframe === '1y' ? 21800 : 12700) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(wilaya.value / (chartTimeframe === '1y' ? 8500 : 4500) * 100)}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: wilaya.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md p-8 rounded-[40px] border border-white shadow-sm font-sans text-primary">
                <h3 className="text-xs font-black uppercase tracking-widest mb-8 italic">Tendances de Sourcing (Search)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={termsData}>
                      <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: '900', textTransform: 'uppercase'}} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{fill: 'rgba(0,0,0,0.02)'}}
                        contentStyle={{ background: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="volume" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-primary p-12 rounded-[48px] text-white relative overflow-hidden">
                <div className="max-w-2xl relative z-10">
                   <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Algorithme de Matching IA</h3>
                   <p className="text-sm font-medium text-white/60 leading-relaxed mb-8">Nous analysons actuellement plus de 1.2M de points de données pour optimiser les recommandations entre les acheteurs industriels et les fournisseurs certifiés.</p>
                   <div className="flex items-center space-x-12">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 text-white">Précision Recom.</p>
                        <p className="text-2xl font-black italic">94.2%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 text-white">Temps Moyen Rep.</p>
                        <p className="text-2xl font-black italic text-secondary">2.4 Jours</p>
                      </div>
                   </div>
                </div>
            </div>
          </motion.div>
        );

      case 'gov-revenue':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Revenu Mensuel (MRR)</p>
                  <h4 className="text-3xl font-black text-primary">2.4M <span className="text-sm font-bold text-gray-300">DZD</span></h4>
                  <div className="mt-4 flex items-center text-success text-[10px] font-black uppercase tracking-widest">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +15.4% vs Mai
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Dépenses Marketing (GADS)</p>
                  <h4 className="text-3xl font-black text-primary">450k <span className="text-sm font-bold text-gray-300">DZD</span></h4>
                  <div className="mt-4 flex items-center text-primary text-[10px] font-black uppercase tracking-widest">
                    <Activity className="h-4 w-4 mr-1" />
                    ROI : 5.3x
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Frais de Transaction</p>
                  <h4 className="text-3xl font-black text-primary">1.2M <span className="text-sm font-bold text-gray-300">DZD</span></h4>
                  <div className="mt-4 flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <Clock className="h-4 w-4 mr-1" />
                    Stabilité : 98%
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest">Derniers Paiements Bancaires</h3>
                  <button onClick={() => showNotify("Génération de l'export en cours...", "success")} className="text-[10px] font-black text-secondary uppercase tracking-widest underline decoration-2 underline-offset-4">Exporter le grand livre</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Client / Entreprise</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Offre</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Montant</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Mode</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[10px]">
                       {[
                         { name: 'Sarl Mecanique plus', plan: 'Gold Annual', amount: '29,900 DZD', method: 'CIB', status: 'Validé' },
                         { name: 'Global Tech DZ', plan: 'Silver Monthly', amount: '4,500 DZD', method: 'Virement', status: 'Attente' },
                         { name: 'Algeria Filtration', plan: 'Gold Annual', amount: '29,900 DZD', method: 'CIB', status: 'Validé' },
                         { name: 'Karim Benali (Pro)', plan: 'Consultant', amount: '12,000 DZD', method: 'Paypal', status: 'Validé' },
                       ].map((pay, i) => (
                         <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-8 py-6 font-black text-primary uppercase">{pay.name}</td>
                           <td className="px-8 py-6 font-bold text-gray-500 uppercase">{pay.plan}</td>
                           <td className="px-8 py-6 font-black text-primary">{pay.amount}</td>
                           <td className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest italic">{pay.method}</td>
                           <td className="px-8 py-6">
                              <span className={cn("px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest", pay.status === 'Validé' ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500")}>{pay.status}</span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        );

      case 'gov-ads':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-primary uppercase italic">Gestion des Publicités</h3>
                <p className="text-gray-500 mt-2">Suivi et administration des espaces publicitaires clients.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-primary mb-6">Demandes en attente</h4>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                       <div>
                         <p className="font-bold text-gray-900">Tech Industry SARL</p>
                         <p className="text-xs text-gray-500 mt-1">Espace: Page d'accueil (Bannière Haut)</p>
                       </div>
                       <div className="flex space-x-2">
                          <button onClick={() => showNotify("Publicité approuvée et programmée", "success")} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">Approuver</button>
                          <button onClick={() => showNotify("Demande de publicité refusée", "error")} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">Refuser</button>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-primary mb-6">Campagnes Actives</h4>
                   <div className="bg-gray-50 p-8 text-center rounded-3xl border border-dashed border-gray-200">
                     <Zap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                     <p className="font-bold text-gray-900">Aucune campagne active</p>
                     <p className="text-xs text-gray-500 mt-1">Les campagnes approuvées apparaîtront ici.</p>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                   <h4 className="font-bold text-primary mb-6">Statistiques Pubs</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                         <span className="text-sm text-gray-500 font-bold">Revenus Pubs (Mois)</span>
                         <span className="font-black text-secondary">0 DZD</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                         <span className="text-sm text-gray-500 font-bold">Impressions Totales</span>
                         <span className="font-black text-primary">0</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-500 font-bold">Clics Totaux</span>
                         <span className="font-black text-primary">0</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'gov-security':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="bg-primary p-12 rounded-[48px] text-white overflow-hidden relative">
                <div className="relative z-10 max-w-2xl">
                   <h3 className="text-3xl font-black uppercase italic mb-4">Protocole de Sécurité Actif</h3>
                   <p className="text-sm font-medium text-white/60 mb-8">Nous utilisons un chiffrement de bout en bout pour les communications et un système de vérification d'identité en 3 étapes pour chaque entreprise.</p>
                   <div className="flex space-x-8">
                      <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 bg-success rounded-full" />
                         <span className="text-[10px] font-black uppercase">Pare-feu B2B Actif</span>
                      </div>
                      <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 bg-success rounded-full" />
                         <span className="text-[10px] font-black uppercase">KYC Automatisé</span>
                      </div>
                   </div>
                </div>
                <ShieldCheck className="absolute -right-20 -bottom-20 h-80 w-80 text-white/5 -rotate-12" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                   <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-6 italic">Tentatives d'accès suspectes</h4>
                   <div className="space-y-4">
                      {[
                        { ip: '192.168.1.45', location: 'Alger', method: 'Brute force', status: 'Bloqué' },
                        { ip: '45.22.10.8', location: 'Unknown', method: 'Proxy/VPN', status: 'Flagged' },
                      ].map((log, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                           <div>
                              <p className="text-[10px] font-black text-primary">{log.ip}</p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{log.location} • {log.method}</p>
                           </div>
                           <span className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest">{log.status}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                   <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-6 italic">Audit des Actions Staff</h4>
                   <div className="space-y-4">
                      {[
                        { user: 'Abdallah S.', action: 'Validation KYC #492', time: '10 min' },
                        { user: 'Salim R.', action: 'Modération AO #221', time: '1h' },
                      ].map((action, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                           <div>
                              <p className="text-[10px] font-black text-primary uppercase leading-tight italic">{action.action}</p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{action.user}</p>
                           </div>
                           <span className="text-[8px] font-black text-gray-300 uppercase italic">{action.time}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        );

      case 'gov-overview':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsAdmin.map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-md p-7 rounded-[32px] border border-white shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}><stat.icon className="h-6 w-6" /></div>
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest bg-success/10 text-success">{stat.trend}</span>
                  </div>
                  <p className="text-[9px] text-primary/30 font-black uppercase tracking-[0.2em] leading-none mb-3">{stat.label}</p>
                  <h3 className="text-3xl font-black text-primary leading-none tracking-tight">{stat.value}</h3>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white/70 backdrop-blur-md p-8 rounded-[40px] border border-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 text-primary">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest italic">Performance du Business Model</h3>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Revenus directs & croissance de l'écosystème</p>
                    </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white/70 backdrop-blur-md p-8 rounded-[40px] border border-white shadow-sm text-primary">
                  <h3 className="text-sm font-black uppercase mb-6 flex items-center italic">
                    <Activity className="h-4 w-4 mr-2 text-secondary" />
                    Flux d'activité
                  </h3>
                  <div className="space-y-6">
                    {[
                      { icon: Users, title: 'Nouvelle Inscription', desc: 'Sonelgaz (Acheteur)', time: 'À l\'instant' },
                      { icon: ShieldCheck, title: 'KYC Validé', desc: 'Algeria Tech Solutions', time: '2 min' },
                    ].map((activity, i) => (
                      <div key={i} className="flex space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase italic">{activity.title}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase truncate">{activity.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'gov-companies':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Vérifications KYC <span className="text-secondary">({pendingKYC.length} En attente)</span></h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Validation des documents légaux pour le badge "Verified Solution"</p>
              </div>
              <div className="flex space-x-2">
                 <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    {approvedKYC.length} Validés ce jour
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <AnimatePresence>
                 {pendingKYC.length > 0 ? (
                   pendingKYC.map((c) => (
                     <motion.div 
                        key={c.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group shadow-hover transition-all"
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Building2 className="h-20 w-20" /></div>
                        <div className="relative z-10 font-sans">
                           <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">{c.activity || 'ACTIVITÉ NON SPÉCIFIÉE'}</span>
                           <h4 className="text-xl font-black text-primary uppercase tracking-tighter mb-1">{c.name || c.company_name || 'ENTREPRISE'}</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase mb-8">Soumis le {c.date || (c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : 'N/A')}</p>
                           
                           <div className="space-y-3 mb-8">
                              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Documents fournis :</p>
                              <div className="flex flex-wrap gap-2">
                                 {c.docsList && c.docsList.length > 0 ? c.docsList.map((d: any) => (
                                   <a key={d.document_type} href={d.file_url} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center space-x-2 group/doc cursor-pointer hover:bg-white hover:border-secondary transition-all">
                                      <FileText className="h-3 w-3 text-secondary group-hover/doc:scale-110" />
                                      <span className="text-[9px] font-black text-primary uppercase">{d.document_type}.PDF</span>
                                   </a>
                                 )) : (
                                   <p className="text-[10px] text-gray-500 italic">Aucun document joint</p>
                                 )}
                              </div>
                           </div>
    
                           <div className="flex space-x-3">
                              <button 
                                onClick={() => handleApproveKYC(c.id, c.name)}
                                className="flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                              >
                                Approuver
                              </button>
                              <button 
                                onClick={() => handleRejectKYC(c.id, c.name)}
                                className="flex-1 border border-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-500 transition-all active:scale-95"
                              >
                                Rejeter
                              </button>
                           </div>
                        </div>
                     </motion.div>
                   ))
                 ) : (
                   <div className="col-span-full py-20 text-center bg-white/50 rounded-[40px] border border-dashed border-gray-200">
                      <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-20" />
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Toutes les demandes ont été traitées</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        );

      case 'gov-support':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-primary uppercase tracking-tight">Support & Assistance Technique</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gérez les demandes d'assistance des exposants et utilisateurs</p>
                  </div>
                  <div className="flex bg-gray-50 p-1 rounded-xl">
                    <button className="px-4 py-2 bg-white rounded-lg text-[10px] font-black text-primary shadow-sm uppercase tracking-widest" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>Ouverts (5)</button>
                    <button className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>Fermés</button>
                  </div>
               </div>
               <div className="p-8 space-y-4">
                  {[
                    { user: "Sarl Algeria Tech", subject: "Problème upload PDF catalogue", priority: "Haute", status: "Nouveau" },
                    { user: "Mecanique Plus", subject: "Question sur le badge de certification", priority: "Moyenne", status: "En cours" },
                    { user: "Karim Benali", subject: "Accès console restreint", priority: "Haute", status: "Nouveau" },
                  ].map((ticket, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-secondary transition-all group">
                       <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary shadow-sm">{ticket.user.charAt(0)}</div>
                          <div>
                             <h4 className="text-xs font-black text-primary uppercase mb-1">{ticket.subject}</h4>
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{ticket.user} • Priorité {ticket.priority}</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            ticket.status === 'Nouveau' ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-primary text-white"
                          )}>{ticket.status}</span>
                          <button className="p-3 bg-white text-gray-400 rounded-xl hover:text-primary transition-all shadow-sm" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}><ChevronRight className="h-4 w-4" /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        );

      case 'gov-users':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Base Utilisateurs</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gérez les accès et les rôles des 1,240 membres</p>
               </div>
               <button onClick={() => showNotify("Création d'un membre d'équipe...", "success")} className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Ajouter Staff</span>
               </button>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-50">
                     <tr>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Utilisateur</th>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Type / Rôle</th>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Statut</th>
                        <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {[
                       { name: 'Ahmed Mansouri', email: 'a.mansouri@sonatrach.dz', role: 'Acheteur Pro', status: 'Actif' },
                       { name: 'Sarl Plastique DZ', email: 'contact@plastique.dz', role: 'Exposant Gold', status: 'Actif' },
                       { name: 'Salim Reda', email: 'admin@ais.dz', role: 'Modérateur', status: 'Actif' },
                     ].map((u, i) => (
                       <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                          <td className="p-6">
                             <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-primary uppercase">{u.name.charAt(0)}</div>
                                <div>
                                   <p className="text-xs font-black text-primary uppercase">{u.name}</p>
                                   <p className="text-[9px] font-bold text-gray-400 uppercase">{u.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-6 text-[10px] font-black text-gray-500 uppercase">{u.role}</td>
                          <td className="p-6">
                             <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest">{u.status}</span>
                          </td>
                          <td className="p-6 text-right">
                             <button className="p-2 text-gray-400 hover:text-primary" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}><MoreVertical className="h-4 w-4" /></button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        );

      case 'gov-categories':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="flex justify-between items-end mb-8">
               <div>
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Secteurs & Catégories</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Organisez la hiérarchie du catalogue industriel</p>
               </div>
               <button onClick={() => showNotify("Création de catégorie...", "success")} className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouvelle Catégorie</span>
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {['Énergie & Pétrole', 'BTP & Construction', 'Mécanique de Précision', 'Agriculture & Agro', 'Textile & Confection'].map((cat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:border-secondary transition-all">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all"><LayoutList className="h-4 w-4" /></div>
                       <div>
                          <p className="text-xs font-black text-primary uppercase">{cat}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{(i+5)*10} Sous-catégories</p>
                       </div>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-primary transition-all" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}><ChevronRight className="h-4 w-4" /></button>
                 </div>
               ))}
            </div>
          </motion.div>
        );

      case 'gov-products':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="flex justify-between items-end mb-8">
               <div>
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Base de Données Produits</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{(1240)} Produits référencés sur la plateforme</p>
               </div>
               <div className="flex space-x-3">
                  <button onClick={() => showNotify("Ouverture des filtres de secteur...", "success")} className="bg-white border border-gray-100 text-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtrer par Secteur</span>
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100 font-sans">
                     <tr>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Produit</th>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Exposant</th>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Status</th>
                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase">Score IA</th>
                        <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {[
                       { name: 'Unité de Pompage HP-X', company: 'Algeria Tech', status: 'Certifié', score: 98, color: 'text-emerald-500' },
                       { name: 'Turbine Gaz GT-100', company: 'Sonatrach (Vendor)', status: 'En attente', score: 85, color: 'text-orange-500' },
                       { name: 'Câble Armé 10mm', company: 'Mecanique Plus', status: 'Certifié', score: 92, color: 'text-emerald-500' },
                     ].map((p, i) => (
                       <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                          <td className="p-6">
                             <div>
                                <p className="text-xs font-black text-primary uppercase">{p.name}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Ref: #PRD-2026-00{i}</p>
                             </div>
                          </td>
                          <td className="p-6 text-[10px] font-black text-gray-500 uppercase">{p.company}</td>
                          <td className="p-6">
                             <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest", p.status === 'Certifié' ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500")}>
                                {p.status}
                             </span>
                          </td>
                          <td className="p-6 font-black text-primary text-xs">{p.score}%</td>
                          <td className="p-6 text-right">
                             <div className="flex justify-end space-x-2">
                                <button onClick={() => showNotify("Redirection vers la page produit...", "success")} className="p-2 bg-gray-50 text-gray-400 hover:text-primary rounded-lg transition-all"><Eye className="h-4 w-4" /></button>
                                <button onClick={() => showNotify("Ouverture de l'éditeur de produit...", "success")} className="p-2 bg-gray-50 text-gray-400 hover:text-secondary rounded-lg transition-all"><Edit2 className="h-4 w-4" /></button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        );


      case 'site-cms':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="flex justify-between items-end mb-8">
               <div>
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Gestion du Contenu</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Publiez les actualités et l'encyclopédie industrielle</p>
               </div>
               <div className="flex space-x-3">
                  <button onClick={() => showNotify("Création de catégorie en cours...", "success")} className="bg-white border border-gray-100 text-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Nouv. Catégorie</button>
                  <button 
                    onClick={() => setShowArticleForm(true)}
                    className="bg-secondary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:scale-105 transition-all shadow-lg shadow-secondary/20"
                  >
                     <Plus className="h-4 w-4" />
                     <span>Rédiger Article</span>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "Transition Industrie 4.0", type: "Blog", status: "Publié", views: "1.2k" },
                 { title: "Guide de la Maintenance 2026", type: "Ressource", status: "Publié", views: "4.5k" },
                 { title: "E-procurement en Algérie", type: "Actualité", status: "Brouillon", views: "0" },
               ].map((item, i) => (
                 <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                    <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-secondary/5 transition-colors">
                       <Newspaper className="h-10 w-10" />
                    </div>
                    <div className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{item.type}</span>
                          <span className={cn("text-[9px] font-black px-2 py-1 rounded-md uppercase", item.status === 'Publié' ? "bg-emerald-50 text-emerald-500" : "bg-gray-100 text-gray-400")}>{item.status}</span>
                       </div>
                       <h4 className="text-sm font-black text-primary uppercase tracking-tight mb-4 group-hover:text-secondary transition-colors line-clamp-2 italic">{item.title}</h4>
                       <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400">
                             <Eye className="h-3 w-3" />
                             <span>{item.views}</span>
                          </div>
                          <div className="flex space-x-1">
                             <button onClick={() => showNotify("Ouverture de l'article pour édition...", "success")} className="p-2 text-gray-400 hover:text-primary transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
                             <button onClick={() => showNotify("Article supprimé de la base de données", "error")} className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        );

      case 'site-settings':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic mb-8">Configuration Système</h3>
            <div className="bg-white rounded-[48px] border border-gray-100 shadow-xl p-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <div>
                           <p className="text-xs font-black text-primary uppercase">Mode Maintenance</p>
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Suspendre l'accès public au portail</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                           <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest italic flex items-center">
                           <ShieldCheck className="h-4 w-4 mr-2 text-secondary" />
                           Niveau de sécurité API
                        </label>
                        <select className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl outline-none focus:border-secondary transition-all">
                           <option>Standard (Filtres B2B)</option>
                           <option>Renforcé (Strict KYC)</option>
                           <option>Critique (Mode Audit)</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest italic">Commission Globale (%)</label>
                        <div className="flex items-center space-x-4">
                           <input type="range" className="flex-1 accent-secondary" />
                           <span className="text-xl font-black text-secondary">2.5%</span>
                        </div>
                     </div>

                     <div className="p-8 bg-primary rounded-[32px] text-white">
                        <h4 className="text-sm font-black uppercase tracking-tighter mb-4 italic">Sauvegarde Système</h4>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-6">Dernière sauvegarde effectuée aujourd'hui à 04:00 AM sur serveurs Cloud Algeria.</p>
                        <button onClick={() => showNotify("Sauvegarde en cours...", "success")} className="w-full bg-secondary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-105 transition-all">Lancer Backup Manuel</button>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        );

      case 'gov-tenders':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic mb-8">Modération des Appels d'Offres</h3>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En attente de validation (3)</span>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                    { company: 'Sonelgaz', title: 'Fourniture de Transformateurs HT', budget: '120M DZD', date: 'Aujourd\'hui' },
                    { company: 'Cosider', title: 'Location d\'Engins de Terrassement', budget: '15M DZD', date: 'Hier' },
                  ].map((ao, i) => (
                    <div key={i} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all">
                       <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary"><FileText className="h-6 w-6" /></div>
                          <div>
                             <h4 className="text-sm font-black text-primary uppercase tracking-tight mb-1">{ao.title}</h4>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ao.company} • Budget estimé : {ao.budget}</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-3">
                          <button onClick={() => showNotify("Appel d'offres publié.", "success")} className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Publier</button>
                          <button onClick={() => showNotify("Appel d'offres refusé.", "error")} className="px-6 py-3 border border-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-all">Refuser</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        );

      case 'gov-telemetry':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Suivi, Traces & Télémétrie</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Données de session et interactions recueillies en temps réel sur la plateforme
                </p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  clearLogs();
                  setNotification({ message: "Données de navigation réinitialisées.", type: "success" });
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="self-start sm:self-auto px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2"
              >
                <Trash className="h-4 w-4" />
                <span>Effacer les Traces</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[9px] text-primary/30 font-black uppercase tracking-[0.2em]">Durée Session</p>
                  <p className="text-xl font-black text-primary font-mono mt-1">
                    {Math.floor(totalTimeSpentSec / 60)}m {totalTimeSpentSec % 60}s
                  </p>
                </div>
              </div>

              <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[9px] text-primary/30 font-black uppercase tracking-[0.2em]">Pages Consultées</p>
                  <p className="text-xl font-black text-primary font-mono mt-1">{visits.length}</p>
                </div>
              </div>

              <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <MousePointer className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[9px] text-primary/30 font-black uppercase tracking-[0.2em]">Interactions</p>
                  <p className="text-xl font-black text-primary font-mono mt-1">{events.length}</p>
                </div>
              </div>

              <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[9px] text-primary/30 font-black uppercase tracking-[0.2em]">Mode Réseau</p>
                  <p className="text-sm font-black text-primary flex items-center mt-1 uppercase tracking-tight">
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${profile.online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    {profile.online ? 'En Ligne' : 'Hors Ligne'}
                  </p>
                </div>
              </div>
            </div>

            {/* Browser & OS Card */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 italic">Spécifications Techniques Appareil & Navigateur</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="border-r border-gray-100 last:border-0 pr-4 w-full">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Système d'Exploitation</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <span className="font-bold text-sm text-primary">{profile.os}</span>
                  </div>
                </div>

                <div className="border-r border-gray-100 last:border-0 pr-4 w-full">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Navigateur</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <span className="font-bold text-sm text-primary">{profile.browser}</span>
                  </div>
                </div>

                <div className="border-r border-gray-100 last:border-0 pr-4 w-full">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Adresse IP</p>
                  <p className="font-bold text-sm text-emerald-600 mt-2 font-mono truncate" title={profile.ipAddress}>
                    {profile.ipAddress || 'Détection...'}
                  </p>
                </div>

                <div className="border-r border-gray-100 last:border-0 pr-4 w-full">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Langue & Résolution</p>
                  <p className="font-bold text-sm text-primary mt-2">
                    {profile.language.toUpperCase()} • {profile.screenWidth} x {profile.screenHeight} px
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date & Fuseau Horaire</p>
                  <p className="font-bold text-sm text-primary mt-2">
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • (UTC{new Date().getTimezoneOffset() > 0 ? '-' : '+'}{Math.abs(new Date().getTimezoneOffset() / 60)})
                  </p>
                </div>
              </div>
            </div>

            {/* Split page details AND user interactions timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visited Page Timeline */}
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Pages Consultées (Session Actuelle)</h4>
                  <span className="bg-primary/5 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase">Total ({visits.length})</span>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {visits.slice().reverse().map((visit, index) => (
                    <div key={index} className="p-4 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border-l-4 border-secondary transition-all">
                      <div className="flex justify-between items-start">
                        <p className="font-black text-xs text-primary truncate max-w-[200px] sm:max-w-xs">{visit.title}</p>
                        <span className="text-[9px] font-mono text-gray-400 font-bold">
                          {new Date(visit.enterTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-secondary font-mono tracking-tight mt-1 truncate">{visit.path}</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Défilement Max: {visit.scrollDepth}%</span>
                        <span>
                          {visit.durationMs ? `Durée: ${Math.round(visit.durationMs / 1000)}s` : 'Page Actuelle'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {visits.length === 0 && (
                    <div className="text-center py-12 opacity-40">
                      <History className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Aucune visite enregistrée</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Interaction Details Timeline */}
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Derniers Événements Physiques</h4>
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">En Direct ({events.length})</span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {events.map((ev, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <MousePointer className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Clic sur &lt;{ev.targetTag}&gt;</p>
                          <span className="text-[9px] font-mono text-gray-400 font-bold">
                            {new Date(ev.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-primary truncate mt-1">"{ev.targetText || 'Sans texte'}"</p>
                        <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
                          Cible: {ev.currentPath} {ev.targetId && `• ID: ${ev.targetId}`}
                        </p>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-12 opacity-40">
                      <MousePointer className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Effectuez des clics sur l'application pour voir les métriques s'actualiser.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  const menuSections = [
    {
      title: "Pilotage Stratégique",
      items: [
        { id: 'gov-overview', name: 'Vue d\'Ensemble', icon: LayoutDashboard },
        { id: 'gov-analytics', name: 'Analytique Avancée', icon: BarChart3 },
        { id: 'gov-telemetry', name: 'Suivi & Télémétrie', icon: Zap },
        { id: 'gov-revenue', name: 'Gestion Revenus', icon: CreditCard },
        { id: 'gov-ads', name: 'Gestion Publicités', icon: Zap },
      ]
    },
    {
      title: "Gestion Catalogue",
      items: [
        { id: 'gov-products', name: 'Produits & Services', icon: PackagePlus },
        { id: 'gov-categories', name: 'Catégories', icon: LayoutList },
      ]
    },
    {
      title: "Opérations Plateforme",
      items: [
        { id: 'gov-users', name: 'Comptes & Accès', icon: Users },
        { id: 'gov-roles', name: 'Rôles & Staff', icon: ShieldCheck },
        { id: 'gov-security', name: 'Centre de Sécurité', icon: Lock },
        { id: 'gov-companies', name: 'KYC & Entreprises', icon: Building2 },
        { id: 'gov-tenders', name: 'Modération AO', icon: FileText },
        { id: 'gov-support', name: 'Support Technique', icon: MessageSquare },
      ]
    },
    {
      title: "Administration Site",
      items: [
        { id: 'site-cms', name: 'Gestion Contenu', icon: Newspaper },
        { id: 'site-settings', name: 'Config. Système', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-bg flex">
      {/* Sidebar Unifiée - Ultra Pro Dark Edition */}
      <aside className="w-80 bg-[#0a0a0a] border-r border-white/5 flex flex-col sticky top-0 h-screen z-50 transition-all">
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          <div className="mb-10 p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] text-white rounded-[32px] border border-white/5 shadow-2xl">
             <div className="flex items-center space-x-3 mb-6">
               <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20">
                 <ShieldCheck className="h-6 w-6 text-secondary" />
               </div>
               <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-none">Console Pro</span>
                  <p className="text-xs font-black uppercase tracking-tight mt-1 text-white">Espace Unifié</p>
               </div>
             </div>
             <div className="h-px w-full bg-white/5 mb-6" />
             <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">ID: RO-DZ-9210</p>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             </div>
          </div>

          <div className="space-y-10">
            {menuSections.map((section, idx) => (
              <div key={idx}>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.35em] px-4 mb-6">{section.title}</p>
                <div className="space-y-1.5">
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 text-left group relative overflow-hidden",
                        activeTab === item.id 
                          ? "bg-secondary text-white shadow-xl shadow-secondary/20" 
                          : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                      )}
                    >
                      {activeTab === item.id && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80"
                        />
                      )}
                      <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-all duration-300 relative z-10", activeTab === item.id ? "text-white scale-110" : "text-white/20 group-hover:text-secondary group-hover:rotate-12")} />
                      <span className="relative z-10 truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.02]">
           <button className="w-full flex items-center justify-center space-x-3 py-4 text-white/40 hover:text-error transition-all text-[11px] font-black uppercase tracking-widest border border-white/5 rounded-2xl bg-white/[0.03] hover:bg-error/10 hover:border-error/20" onClick={async (e) => { 
                e.preventDefault(); 
                try {
                  await logout();
                  navigate('/');
                } catch (error) {
                  console.error("Erreur déconnexion:", error);
                }
              }}>
              <Globe className="h-4 w-4" />
              <span>DÉCONNEXION</span>
           </button>
        </div>
      </aside>

      {/* Main Container - Ultra Professional Layout */}
      <main className="flex-1 p-10 overflow-y-auto bg-neutral-bg/50">
        <div className="max-w-6xl mx-auto">
           {/* Section Header - Glassmorphism Edition */}
           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6 bg-white/[0.8] backdrop-blur-xl p-6 rounded-[32px] border border-white/40 shadow-sm sticky top-0 z-40">
             <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-10">
                <Link to="/" className="flex items-center space-x-3 group">
                   <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-secondary/20">
                      <Globe className="h-6 w-6 text-white" />
                   </div>
                   <div className="hidden md:block leading-tight">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 leading-none">REGIONAL</span>
                      <p className="text-sm font-black uppercase tracking-tight text-primary leading-none mt-0.5">EXPO CONSOLE</p>
                   </div>
                </Link>
             </div>
             
             <div className="flex items-center space-x-3">
                <div className="hidden xl:flex items-center space-x-4 pr-6 border-r border-primary/5">
                    <div className="text-right">
                       <p className="text-[8px] text-primary/30 font-black uppercase tracking-widest">Network Status</p>
                       <div className="flex items-center justify-end space-x-1.5">
                          <div className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_8px_#10b981]" />
                          <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Algeria North</p>
                       </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-primary/[0.03] p-1.5 rounded-2xl border border-primary/5">
                   <button className="relative p-2.5 text-primary/40 hover:text-secondary hover:bg-white rounded-xl transition-all duration-300" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
                   </button>
                   <div className="h-8 w-px bg-primary/5 mx-1" />
                   <div className="flex items-center space-x-3 pl-1 pr-3 py-1 group cursor-pointer hover:bg-white rounded-xl transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-white flex items-center justify-center font-black text-sm uppercase shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        AS
                      </div>
                      <div className="hidden sm:block text-left leading-none">
                        <p className="text-[10px] font-black text-primary uppercase">Abdallah S.</p>
                        <p className="text-[8px] text-primary/40 font-bold uppercase mt-1 tracking-widest">Verified Admin</p>
                      </div>
                   </div>
                </div>
             </div>
           </div>

           {/* Tab Content Rendering */}
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, scale: 0.99 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.01 }}
               transition={{ duration: 0.2 }}
             >
               {renderContent()}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* Article Form Modal */}
      <AnimatePresence>
        {showArticleForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-[80vh]">
                <div className="w-80 bg-gray-50 p-10 border-r border-gray-100 hidden md:block">
                  <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-8 italic">Nouvel Article</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Image de Couverture</label>
                      <div className="aspect-video bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-300 hover:border-secondary hover:text-secondary cursor-pointer transition-all">
                        <Plus className="h-6 w-6 mb-2" />
                        <span className="text-[8px] font-black uppercase">Upload Image</span>
                      </div>
                    </div>
                    <div className="p-6 bg-secondary/10 rounded-3xl">
                      <p className="text-[9px] font-bold text-secondary leading-relaxed uppercase">
                        Les articles sont publiés dans la section "Actualités & Blog" et notifiés aux utilisateurs abonnés.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
                  <div className="flex justify-end mb-6">
                    <button onClick={() => setShowArticleForm(false)} className="p-2 text-gray-400 hover:text-primary transition-all">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest">Titre de l'article</label>
                      <input 
                        type="text" 
                        placeholder="Ex: La transition énergétique en Algérie..."
                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest">Catégorie</label>
                        <select className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-secondary/20 outline-none">
                          <option>Actualité</option>
                          <option>Blog</option>
                          <option>Ressource</option>
                          <option>Étude de Cas</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest">Temps de lecture</label>
                        <input type="text" placeholder="5 min" className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-xs font-bold outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest">Contenu (Markdown)</label>
                      <textarea 
                        rows={10}
                        placeholder="Rédigez votre contenu ici..."
                        className="w-full bg-gray-50 border-none px-6 py-6 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-secondary/20 transition-all outline-none resize-none"
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button onClick={() => { showNotify("Article publié avec succès", "success"); setShowArticleForm(false); }} className="flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Publier Maintenant</button>
                      <button 
                        onClick={() => setShowArticleForm(false)}
                        className="px-8 border border-gray-100 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all"
                      >
                        Annuler
                      </button>
                    </div>
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
              "fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center space-x-4 border",
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

export default ConsolePro;

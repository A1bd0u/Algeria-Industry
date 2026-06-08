import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2, Download,
  FileStack,
  FileText,
  Globe,
  Info,
  Lock,
  MessageSquare,
  Send,
  ShieldCheck,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TenderDetailSkeleton } from '../components/Skeleton';
import { cn } from '../lib/utils';

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isResponding, setIsResponding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [tender, setTender] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTender = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/tenders/${id}`).catch(() => null);
        let data;
        
        if (res && res.ok) {
           data = await res.json();
        } else {
           // Fallback mock data
           if (id === '2') {
             data = {
               id: '2',
               reference_id: 'TND-9C4M1V',
               title: "Installation de système anti-incendie",
               category: "Sécurité",
               author: { company: "Cosider Construction" },
               deadline: "2026-06-15",
               created_at: "2026-05-10",
               status: "Urgent",
               description: "Installation système de sécurité incendie complet pour le nouveau hangar industriel. Veuillez inclure le devis détaillé."
             };
           } else {
             data = {
               id: '1',
               reference_id: 'TND-B82XQL',
               title: "Fourniture de pompes centrifuges",
               category: "Équipement",
               author: { company: "Sonatrach SPA" },
               deadline: "2026-07-20",
               created_at: "2026-06-01",
               status: "open",
               description: "Demande de fourniture pour 10 pompes centrifuges industrielles haut débit."
             };
           }
        }
        
        // Map to expected structure for the UI
        setTender({
          id: data.id,
          title: data.title,
          company: data.author?.company || "Entreprise Inconnue",
          sector: data.category || "General",
          deadline: new Date(data.deadline).toLocaleDateString(),
          published: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A',
          type: data.type || "Public",
          status: data.status === 'open' ? 'Ouvert' : data.status || 'Inconnu',
          description: data.description,
          budget: data.budget ? `Budget: ${data.budget} DZD` : "Non spécifié",
          reference: data.reference_id || `AO-${data.id?.substring(0, 8) || '0000'}`,
          location: "Algérie",
          requirements: [
             "Certificat de qualification de catégorie V minimum.",
             "Expérience prouvée de 5 ans.",
             "Garantie de 12 mois sur les pièces de rechange fournies."
          ],
          documents: [
             { name: "Cahier des charges technique.pdf", size: "2.4 MB" }
          ]
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchTender();
  }, [id]);

  const handleResponse = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/dashboard?tab=orders');
    }, 2000);
  };

  if (isLoading) {
    return <TenderDetailSkeleton />;
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
         <div className="bg-red-50 text-red-500 p-8 border border-red-100 font-bold max-w-md text-center">
            <AlertCircle className="h-10 w-10 mx-auto mb-4" />
            <p className="uppercase tracking-widest text-xs">{error || "Introuvable"}</p>
            <button onClick={() => navigate('/tenders')} className="mt-6 text-[10px] uppercase font-black underline">Retour aux appels d'offres</button>
         </div>
      </div>
    );
  }

  if (isSuccess) {
     return (
       <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white p-12 max-w-md w-full border border-gray-100 shadow-2xl text-center"
         >
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="h-10 w-10 text-emerald-500" />
           </div>
           <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">Réponse Soumise !</h2>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
             Votre proposition technique et commerciale a été envoyée avec succès à {tender.company}.
           </p>
           <div className="mt-8 pt-8 border-t border-gray-50">
              <p className="text-[10px] font-black text-primary uppercase animate-pulse">Redirection vers votre dashboard...</p>
           </div>
         </motion.div>
       </div>
     );
  }

  return (
    <div className={cn("min-h-screen bg-neutral-bg pb-20", i18n.language === 'ar' && "font-arabic")}>
      {/* Dynamic Header */}
      <div className="bg-white border-b border-gray-100 pt-6 pb-12 text-primary overflow-hidden relative">
         <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à la liste</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <div className="max-w-3xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 border",
                      tender.type === 'Public' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
                    )}>
                      {tender.type === 'Public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>{tender.type}</span>
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                       {tender.status}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Réf: {tender.reference}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                    {tender.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-8">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                           <Building2 className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ÉMETTEUR</p>
                           <p className="text-xs font-black uppercase">{tender.company}</p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                           <Calendar className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">DATE DE FIN</p>
                           <p className="text-xs font-black uppercase">{tender.deadline}</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-gray-50 p-8 border border-gray-100 rounded-none shrink-0 min-w-[300px]">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Urgence & Statut</p>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400">Temps restant</span>
                        <span className="text-lg font-black text-secondary uppercase font-mono">12 JOURS</span>
                     </div>
                     <div className="h-2 w-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-secondary w-2/3" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
               {/* Description */}
               <div className="bg-white p-10 border border-gray-100 shadow-xl">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center border-b border-gray-50 pb-4">
                    <Info className="h-4 w-4 mr-2 text-secondary" />
                    Description détaillée
                  </h3>
                  <p className="text-gray-500 font-medium leading-loose mb-10">
                    {tender.description}
                  </p>
                  
                  <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-6">Exigences Techniques & Critères :</h4>
                  <ul className="space-y-4">
                    {tender.requirements.map((req, i) => (
                      <li key={i} className="flex items-start space-x-4">
                        <div className="w-1.5 h-1.5 bg-secondary mt-1.5 shrink-0" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
               </div>

               {/* Documents */}
               <div className="bg-white p-10 border border-gray-100 shadow-xl">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center border-b border-gray-50 pb-4">
                    <FileStack className="h-4 w-4 mr-2 text-secondary" />
                    Pièces Jointes (Dossier d'Appel d'Offres)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tender.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 group hover:bg-primary transition-all">
                        <div className="flex items-center space-x-3">
                           <FileText className="h-5 w-5 text-secondary" />
                           <div>
                              <p className="text-[10px] font-black text-primary group-hover:text-white uppercase truncate max-w-[150px]">{doc.name}</p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase">{doc.size}</p>
                           </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-secondary transition-colors focus:outline-none" onClick={(e) => { e.preventDefault(); e.currentTarget.classList.toggle('text-secondary'); e.currentTarget.classList.toggle('text-gray-400'); }}>
                           <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Right Column / Respond Sidebar */}
            <aside className="space-y-8">
               {isResponding ? (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white p-8 border-t-4 border-secondary shadow-2xl"
                 >
                   <h3 className="text-lg font-black text-primary uppercase tracking-tighter mb-8 italic underline decoration-secondary decoration-2">Votre Proposition</h3>
                   <form onSubmit={handleResponse} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">MONTANT HT (DZD)</label>
                         <input required type="text" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-xs font-bold font-mono outline-none focus:border-secondary transition-all" placeholder="00,000,000.00" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">DÉLAI D'EXÉCUTION</label>
                         <input required type="text" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-xs font-bold outline-none focus:border-secondary transition-all" placeholder="EX: 30 JOURS" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">NOTE DE SYNTHÈSE</label>
                         <textarea className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-xs font-bold outline-none focus:border-secondary transition-all h-32 resize-none" placeholder="RÉSUMÉ DE VOTRE FORCE TECHNIQUE..." />
                      </div>
                      <div className="p-6 border-2 border-dashed border-gray-100 rounded-none text-center group hover:border-secondary transition-all cursor-pointer">
                         <Download className="h-6 w-6 text-gray-200 mx-auto mb-2 group-hover:text-secondary group-hover:-rotate-12 transition-all" />
                         <p className="text-[9px] font-black text-gray-400 uppercase group-hover:text-primary">Déposer Offre PDF</p>
                      </div>
                      <button type="submit" className="w-full bg-primary py-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center space-x-3">
                         <Send className="h-4 w-4" />
                         <span>Soumettre Offre</span>
                      </button>
                      <button type="button" onClick={() => setIsResponding(false)} className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all">Annuler</button>
                   </form>
                 </motion.div>
               ) : (
                 <div className="bg-white p-8 border border-gray-100 shadow-xl">
                   <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center border-b border-gray-50 pb-4">
                    <ShieldCheck className="h-5 w-5 mr-3 text-emerald-500" />
                    Garanties & Support
                   </h3>
                   <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                         <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" />
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-primary uppercase mb-1">VÉRIFICATION KYC</p>
                            <p className="text-[9px] text-gray-400 font-bold leading-tight uppercase">BÉNÉFICIEZ DE LA PROTECTION JURIDIQUE DE LA PLATEFORME.</p>
                         </div>
                      </div>
                      <div className="flex items-start space-x-4 text-primary">
                         <div className="p-2 bg-primary/5 rounded-lg">
                            <MessageSquare className="h-4 w-4" />
                         </div>
                         <div>
                            <p className="text-[11px] font-black uppercase mb-1">CHAT TECHNIQUE</p>
                            <p className="text-[9px] text-gray-400 font-bold leading-tight uppercase">POSEZ VOS QUESTIONS DIRECTEMENT À L'ACHETEUR.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setIsResponding(true)}
                        className="w-full bg-secondary py-5 flex items-center justify-center space-x-3 group"
                      >
                         <span className="text-[11px] font-black text-white uppercase tracking-widest">RÉPONDRE À L'OFFRE</span>
                         <Send className="h-4 w-4 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                   </div>
                 </div>
               )}

               {/* Help Widget */}
               <div className="bg-gray-50 border border-gray-100 p-10 text-primary rounded-none">
                  <User className="h-10 w-10 text-secondary mb-6" />
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Besoin d'aide ?</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                    Nos experts métiers vous accompagnent dans la rédaction de votre offre technique.
                  </p>
                  <button className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['Cahier des charges'], {type: 'application/pdf'})); a.download = 'cahier_des_charges.pdf'; a.click(); }}>
                    Contacter un conseiller →
                  </button>
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
};

export default TenderDetail;

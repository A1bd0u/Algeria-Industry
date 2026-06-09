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
      <div className="bg-[#0a0a0a] pt-10 pb-16 text-white overflow-hidden relative">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à la liste</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <div className="max-w-3xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 border",
                      tender.type === 'Public' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    )}>
                      {tender.type === 'Public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>{tender.type}</span>
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                       {tender.status}
                    </span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Réf: {tender.reference}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                    {tender.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-8">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                           <Building2 className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">ÉMETTEUR</p>
                           <p className="text-xs font-black uppercase">{tender.company}</p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                           <Calendar className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">DATE DE FIN</p>
                           <p className="text-xs font-black uppercase">{tender.deadline}</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-gradient-to-br from-white/10 to-transparent p-8 border border-white/20 rounded-2xl shrink-0 min-w-[300px] backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-6 flex items-center">
                     <span className="w-2 h-2 bg-secondary animate-pulse rounded-full mr-2" />
                     Statut de l'offre
                  </p>
                  <div className="space-y-4 relative z-10">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/80">Date de clôture</span>
                        <span className="text-xl font-black text-white uppercase font-mono tracking-tighter">12 JOURS</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 overflow-hidden rounded-full">
                        <div className="h-full bg-gradient-to-r from-secondary/50 to-secondary w-2/3 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 space-y-12">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

         {/* Full-width Response Section */}
         <div id="response-form-section">
            {isResponding ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 md:p-16 border-t-4 border-secondary shadow-2xl"
              >
                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-10 italic underline decoration-secondary decoration-2">Votre Proposition technique et commerciale</h3>
                <form onSubmit={handleResponse} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">MONTANT HT (DZD)</label>
                         <input required type="text" className="w-full bg-gray-50 border border-gray-100 px-5 py-4 text-sm font-bold font-mono outline-none focus:border-secondary transition-all" placeholder="00,000,000.00" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">DÉLAI D'EXÉCUTION</label>
                         <input required type="text" className="w-full bg-gray-50 border border-gray-100 px-5 py-4 text-sm font-bold outline-none focus:border-secondary transition-all" placeholder="EX: 30 JOURS" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">NOTE DE SYNTHÈSE</label>
                      <textarea className="w-full bg-gray-50 border border-gray-100 px-5 py-4 text-sm font-bold outline-none focus:border-secondary transition-all h-40 resize-none" placeholder="RÉSUMÉ DE VOTRE FORCE TECHNIQUE..." />
                   </div>
                   <div className="p-10 border-2 border-dashed border-gray-200 bg-gray-50 rounded-none text-center group hover:border-secondary transition-all cursor-pointer">
                      <Download className="h-8 w-8 text-gray-300 mx-auto mb-3 group-hover:text-secondary group-hover:-rotate-12 transition-all" />
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-primary">Déposer Offre PDF</p>
                   </div>
                   <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                      <button type="submit" className="w-full sm:w-2/3 bg-primary py-5 text-xs font-black text-white uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center space-x-3">
                         <Send className="h-5 w-5" />
                         <span>Soumettre l'Offre Définitive</span>
                      </button>
                      <button type="button" onClick={() => setIsResponding(false)} className="w-full sm:w-1/3 py-5 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 hover:text-primary transition-all border border-transparent">Annuler</button>
                   </div>
                </form>
              </motion.div>
            ) : (
                <button 
                  onClick={() => {
                    setIsResponding(true);
                    setTimeout(() => {
                      const formEl = document.getElementById('response-form-section');
                      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full bg-secondary py-8 flex items-center justify-center space-x-4 group shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all cursor-pointer"
                >
                   <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">RÉPONDRE À L'OFFRE</span>
                   <Send className="h-6 w-6 text-white group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </button>
            )}
         </div>

         {/* Bottom Information Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
             <div className="bg-white p-8 border border-gray-100 shadow-xl h-full">
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
               </div>
             </div>

             <div className="bg-gray-50 border border-gray-100 p-10 text-primary rounded-none h-full">
                <User className="h-10 w-10 text-secondary mb-6" />
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Besoin d'aide ?</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Nos experts métiers vous accompagnent dans la rédaction de votre offre technique.
                </p>
                <button className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['Cahier des charges'], {type: 'application/pdf'})); a.download = 'cahier_des_charges.pdf'; a.click(); }}>
                  Contacter un conseiller →
                </button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default TenderDetail;

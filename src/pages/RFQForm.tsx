import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Loader2,
  Mail,
  Package,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const RFQForm = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [items, setItems] = useState([{ id: 1, name: '', qty: '' }]);

  const addItem = () => setItems([...items, { id: Date.now(), name: '', qty: '' }]);
  const removeItem = (id: number) => items.length > 1 && setItems(items.filter(i => i.id !== id));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
       const formData = new FormData(e.target as HTMLFormElement);
       await fetch('/api/rfqs', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            title: formData.get('title'),
            desiredDate: formData.get('date'),
            items,
            budget: formData.get('budget')
         })
       });
       setIsSuccess(true);
       setTimeout(() => navigate('/dashboard?tab=orders'), 3000);
    } catch (e) {
       console.error("Erreur d'envoi", e);
    } finally {
       setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 max-w-md w-full border border-gray-100 shadow-2xl text-center rounded-[48px]"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4 italic">Demande Envoyée</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">
            Votre Request for Quotation (RFQ) a été transmise aux services achats et commerciaux concernés.
          </p>
          <div className="flex flex-col space-y-4">
             <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase">Réf Dossier :</span>
                <span className="text-xs font-black text-primary uppercase">RFQ-2026-X84</span>
             </div>
             <p className="text-[9px] font-black text-secondary uppercase animate-pulse">Redirection vers votre suivi...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-neutral-bg pt-32 pb-20", i18n.language === 'ar' && "font-arabic")}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 text-secondary mb-4"
          >
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sourcing Express</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-4 leading-none italic">
            Request for <span className="text-secondary">Quotation</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-lg mx-auto">
            Gagnez du temps. Une seule demande, plusieurs offres techniques et commerciales sous 48h.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-12">
           <div className="flex items-center space-x-4">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center">
                   <div className={cn(
                     "w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all",
                     step === s ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : 
                     step > s ? "bg-secondary text-white" : "bg-white text-gray-300 border border-gray-100"
                   )}>
                     {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                   </div>
                   {s < 3 && (
                     <div className={cn("w-12 h-px mx-4", step > s ? "bg-secondary" : "bg-gray-200")} />
                   )}
                </div>
              ))}
           </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[48px] border border-gray-100 shadow-2xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="border-b border-gray-50 pb-6 mb-8">
                  <h3 className="text-xl font-black text-primary uppercase tracking-tighter flex items-center">
                    <Package className="h-6 w-6 mr-3 text-secondary" />
                    Spécifications Produits
                  </h3>
                </div>
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                       <div className="md:col-span-1 text-[10px] font-black text-gray-300 uppercase py-4">#{idx+1}</div>
                       <div className="md:col-span-7 space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Désignation de la machine / composant</label>
                          <input required type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all" placeholder="EX: POMPE HYDRAULIQUE V3..." />
                       </div>
                       <div className="md:col-span-3 space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Quantité</label>
                          <input required type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all" placeholder="EX: 5 UNITÉS" />
                       </div>
                       <div className="md:col-span-1 mb-1">
                          <button 
                            type="button" 
                            onClick={() => removeItem(item.id)}
                            className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                       </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addItem}
                    className="flex items-center space-x-3 text-[10px] font-black text-secondary uppercase tracking-[0.2em] pt-4 hover:text-primary transition-colors"
                  >
                     <Plus className="h-4 w-4" />
                     <span>Ajouter un autre article</span>
                  </button>
                </div>
                <div className="pt-8 flex justify-end">
                   <button 
                     type="button" 
                     onClick={() => setStep(2)}
                     className="bg-primary text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all flex items-center space-x-3"
                   >
                      <span>Continuer</span>
                      <ArrowRight className="h-4 w-4" />
                   </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="border-b border-gray-50 pb-6 mb-8">
                  <h3 className="text-xl font-black text-primary uppercase tracking-tighter flex items-center">
                    <Building2 className="h-6 w-6 mr-3 text-secondary" />
                    Informations Acheteur
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entreprise / Institution</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input required type="text" className="w-full bg-gray-50 border border-gray-100 pl-12 pr-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all" placeholder="NOM DE SOCIÉTÉ..." />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secteur d'activité</label>
                      <select className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all appearance-none">
                         <option>PÉTROCHIMIE</option>
                         <option>AGROALIMENTAIRE</option>
                         <option>BTPH</option>
                         <option>MINES</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Professionnel</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input required type="email" className="w-full bg-gray-50 border border-gray-100 pl-12 pr-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all" placeholder="EMAIL@ENTREPRISE.DZ..." />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone / Mobile</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input required type="tel" className="w-full bg-gray-50 border border-gray-100 pl-12 pr-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all" placeholder="+213..." />
                      </div>
                   </div>
                </div>
                <div className="pt-8 flex justify-between">
                   <button 
                     type="button" 
                     onClick={() => setStep(1)}
                     className="text-gray-400 font-black text-[10px] uppercase tracking-widest px-8 py-5"
                   >
                      Retour
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setStep(3)}
                     className="bg-primary text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all flex items-center space-x-3"
                   >
                      <span>Valider les infos</span>
                      <ArrowRight className="h-4 w-4" />
                   </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="border-b border-gray-50 pb-6 mb-8">
                  <h3 className="text-xl font-black text-primary uppercase tracking-tighter flex items-center">
                    <FileText className="h-6 w-6 mr-3 text-secondary" />
                    Conditions & Budget
                  </h3>
                </div>
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget Estimatif (DZD)</label>
                         <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all" placeholder="00,000,000.00" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délai souhaité</label>
                         <select className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all appearance-none">
                            <option>DÈS QUE POSSIBLE</option>
                            <option>SOUS 30 JOURS</option>
                            <option>SOUS 3 MOIS</option>
                            <option>PROGRAMME ANNUEL</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exigences particulières (Maintenance, Garantie, Installation...)</label>
                      <textarea className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold focus:border-secondary outline-none transition-all h-32 resize-none" placeholder="DÉTAILLEZ VOS BESOINS TECHNIQUES ICI..." />
                   </div>
                   
                   <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start space-x-4">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] font-bold text-red-600 uppercase leading-relaxed uppercase tracking-wider">
                         En soumettant ce formulaire, vous acceptez que vos coordonnées soient transmises aux fournisseurs vérifiés par Algerian Industrial Solutions. Votre demande sera soumise à une validation modale.
                      </p>
                   </div>
                </div>
                <div className="pt-8 flex justify-between">
                   <button 
                     type="button" 
                     onClick={() => setStep(2)}
                     className="text-gray-400 font-black text-[10px] uppercase tracking-widest px-8 py-5"
                   >
                      Retour
                   </button>
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="bg-secondary text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center space-x-3 shadow-2xl shadow-secondary/30 disabled:opacity-70 disabled:hover:scale-100"
                   >
                     {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Envoi en cours</span>
                        </>
                     ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Envoyer la RFQ</span>
                        </>
                     )}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-16 flex items-center justify-center space-x-12 opacity-30 grayscale">
           <ShieldCheck className="h-8 w-8" />
           <Globe className="h-8 w-8" />
           <Building2 className="h-8 w-8" />
           <Package className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default RFQForm;

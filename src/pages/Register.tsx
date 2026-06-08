import { ArrowRight, Briefcase, Building2, CheckCircle2, Loader2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Register = () => {
  const [role, setRole] = useState<'acheteur' | 'fournisseur' | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        window.location.href = '/dashboard';
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOAuthConnect = async (provider: 'google' | 'linkedin') => {
    try {
      const response = await fetch(`/api/auth/oauth/url?provider=${provider}`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const { url } = await response.json();
      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );
      if (!authWindow) {
        setError('Veuillez autoriser les popups pour vous inscrire.');
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError('Impossible d\'initier l\'inscription avec ' + provider);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: formData.companyName,
        role: role as any,
        password: formData.password
      });
      navigate('/register-success');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-bg px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Info */}
          <div className="md:w-5/12 bg-primary p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6 leading-tight">Rejoignez l'élite industrielle</h2>
              <ul className="space-y-6">
                <li className="flex items-start space-x-3">
                  <ShieldCheck className="h-6 w-6 text-secondary flex-shrink-0" />
                  <span className="text-sm text-gray-200">Accès sécurisé et vérifié aux entreprises algériennes.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Briefcase className="h-6 w-6 text-secondary flex-shrink-0" />
                  <span className="text-sm text-gray-200">Opportunités d'affaires exclusives chaque jour.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0" />
                  <span className="text-sm text-gray-200">Visibilité nationale et internationale.</span>
                </li>
              </ul>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-400 italic">"La plateforme qui transforme l'industrie algérienne."</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-7/12 p-10">
            {step === 1 ? (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-primary mb-2">Choisissez votre profil</h3>
                <p className="text-gray-500 text-sm mb-8">Pour mieux personnaliser votre expérience.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => setRole('acheteur')}
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 text-left transition-all group",
                      role === 'acheteur' ? "border-secondary bg-secondary/5" : "border-gray-100 hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-2 rounded-lg", role === 'acheteur' ? "bg-secondary text-white" : "bg-gray-100 text-gray-400 group-hover:text-primary")}>
                        <User className="h-6 w-6" />
                      </div>
                      {role === 'acheteur' && <CheckCircle2 className="h-5 w-5 text-secondary" />}
                    </div>
                    <h4 className="font-bold text-primary">Je suis un Acheteur</h4>
                    <p className="text-xs text-gray-500 mt-1">Je cherche des fournisseurs et des produits pour mon entreprise.</p>
                  </button>

                  <button 
                    onClick={() => setRole('fournisseur')}
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 text-left transition-all group",
                      role === 'fournisseur' ? "border-secondary bg-secondary/5" : "border-gray-100 hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-2 rounded-lg", role === 'fournisseur' ? "bg-secondary text-white" : "bg-gray-100 text-gray-400 group-hover:text-primary")}>
                        <Building2 className="h-6 w-6" />
                      </div>
                      {role === 'fournisseur' && <CheckCircle2 className="h-5 w-5 text-secondary" />}
                    </div>
                    <h4 className="font-bold text-primary">Je suis un Fournisseur</h4>
                    <p className="text-xs text-gray-500 mt-1">Je souhaite vendre mes produits et répondre aux appels d'offres.</p>
                  </button>
                </div>

                <button 
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full btn-primary mt-8 py-4 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continuer</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right duration-500">
                <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-400 hover:text-primary mb-4 flex items-center space-x-1">
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  <span>Retour au choix du profil</span>
                </button>
                <h3 className="text-2xl font-bold text-primary mb-6">Créer votre compte</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl animate-in fade-in duration-300">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Nom</label>
                      <input 
                        type="text" 
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                        placeholder="Nom" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Prénom</label>
                      <input 
                        type="text" 
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                        placeholder="Prénom" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Nom de l'entreprise</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input 
                        type="text" 
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                        placeholder="Ex: SARL Industrie" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email professionnel</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                        placeholder="email@entreprise.dz" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input 
                        type="password" 
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-[10px] text-gray-400 mb-4">
                      En vous inscrivant, vous acceptez nos <Link to="/terms" className="text-primary font-bold hover:underline">Conditions Générales</Link> et notre <Link to="/privacy" className="text-primary font-bold hover:underline">Politique de Confidentialité</Link>.
                    </p>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full btn-secondary py-4 rounded-xl font-bold shadow-lg shadow-secondary/20 flex items-center justify-center space-x-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Création en cours...</span>
                        </>
                      ) : (
                        <span>Créer mon compte {role}</span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-medium tracking-widest">Ou s'inscrire avec</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => handleOAuthConnect('google')}
                    className="flex items-center justify-center space-x-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-0.5 rounded text-white overflow-hidden w-4 h-4 flex items-center justify-center font-bold text-[10px]">G</div>
                    <span className="text-sm font-bold text-gray-700">Google</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleOAuthConnect('linkedin')}
                    className="flex items-center justify-center space-x-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-[#0077b5] p-0.5 rounded text-white">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">LinkedIn</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Déjà membre ?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">Connectez-vous</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

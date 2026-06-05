import {
  ArrowRight,
  Globe,
  Info,
  Layout, Maximize2,
  MessageSquare,
  Radio,
  Search,
  ShieldCheck,
  Users,
  Video,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

const VirtualShow = () => {
  const { i18n } = useTranslation();
  const [activeZone, setActiveZone] = useState('main');

  const zones = [
    { id: 'main', name: 'Halle Principale', count: '142 Stands', live: true },
    { id: 'metal', name: 'Secteur Métallurgie', count: '45 Stands', live: false },
    { id: 'auto', name: 'Zone Automobile', count: '68 Stands', live: true },
    { id: 'agro', name: 'Agro-Industrie', count: '31 Stands', live: true },
  ];

  return (
    <div className={cn("min-h-screen bg-[#0a0a0a] text-white pt-24", i18n.language === 'ar' && "font-arabic")}>
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation / Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 py-8 border-b border-white/5">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Radio className="h-4 w-4 text-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Salon Virtuel Live</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
              Digital <span className="text-secondary">Expérience</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Connectés</p>
                <p className="text-lg font-black tracking-tighter">1,248 Industriels</p>
              </div>
            </div>
            <button className="bg-secondary px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20" onClick={(e) => { e.preventDefault(); window.scrollTo({top: window.innerHeight, behavior: 'smooth'}); }}>
              Pass VIP Exposant
            </button>
          </div>
        </div>

        {/* Main Interface Split */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Left: Zone Selector */}
          <aside className="xl:col-span-1 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6">Navigation Maps</h3>
              <div className="space-y-3">
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZone(zone.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left group",
                      activeZone === zone.id 
                        ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20" 
                        : "bg-white/5 border-white/5 hover:border-white/20 text-white/60 hover:text-white"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      {zone.live ? (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                      )}
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight">{zone.name}</p>
                        <p className="text-[9px] font-bold opacity-60 uppercase mt-0.5">{zone.count}</p>
                      </div>
                    </div>
                    <ArrowRight className={cn("h-4 w-4 transition-transform", activeZone === zone.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Search, label: 'Chercher Stand' },
                { icon: MessageSquare, label: 'Support Live' },
                { icon: Info, label: 'Guide Salon' },
                { icon: Video, label: 'Conférences' },
              ].map((item, i) => (
                <button key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all group" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                  <item.icon className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{item.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Center: Main Viewport */}
          <main className="xl:col-span-3 space-y-8">
            <div className="relative aspect-video bg-black rounded-[48px] border border-white/10 overflow-hidden group shadow-2xl">
              {/* Virtual Background Render Placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]"
                alt="Virtual Showroom"
              />
              
              {/* HUD Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Localisation Actuelle</p>
                    <p className="text-xl font-black uppercase tracking-tighter">{activeZone === 'main' ? 'Atrium Central' : `Secteur ${activeZone.toUpperCase()}`}</p>
                  </div>
                  <button className="pointer-events-auto bg-white/10 hover:bg-white/20 p-4 rounded-xl backdrop-blur-md border border-white/10 transition-all" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-center">
                   <div className="pointer-events-auto bg-black/80 backdrop-blur-xl px-10 py-6 rounded-3xl border border-white/20 flex items-center space-x-12 shadow-2xl">
                     <div className="text-center group cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-secondary group-hover:text-white transition-all">
                          <Layout className="h-6 w-6" />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Plan 2D</p>
                     </div>
                     <div className="w-px h-12 bg-white/5" />
                     <div className="text-center group cursor-pointer">
                        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center mb-2 shadow-lg shadow-secondary/30">
                          <Globe className="h-8 w-8 text-white animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Zone 360°</p>
                     </div>
                     <div className="w-px h-12 bg-white/5" />
                     <div className="text-center group cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-secondary group-hover:text-white transition-all">
                          <Video className="h-6 w-6" />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Live Cam</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Interaction Hotspots (Simulated) */}
              <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full bg-secondary/50 border border-white animate-ping" />
              <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full bg-secondary border border-white flex items-center justify-center shadow-2xl cursor-pointer">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Bottom Row: Featured Exhibitors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'METALTECH SPA', tag: 'A l\'honneur', views: '2.4K' },
                { name: 'SOLAR ALGERIA', tag: 'Sponsor Gold', views: '1.8K' },
                { name: 'INDUS CONSEIL', tag: 'Expertise', views: '950' },
              ].map((ex, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{ex.tag}</span>
                    <div className="flex items-center space-x-1 text-white/30 text-[9px] font-black uppercase">
                      <Users className="h-3 w-3" />
                      <span>{ex.views}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight mb-4">{ex.name}</h4>
                  <button className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center space-x-2 group" onClick={(e) => { e.preventDefault(); alert("Fonctionnalité en cours de développement"); }}>
                    <span>Visiter ce stand</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Tech Footer Overlay */}
        <div className="mt-20 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] gap-6">
          <div className="flex items-center space-x-8">
            <span className="flex items-center space-x-2"><ShieldCheck className="h-3 w-3 text-secondary" /> <span>Encrypted Stream</span></span>
            <span className="flex items-center space-x-2"><Zap className="h-3 w-3 text-secondary" /> <span>Ultra Low Latency</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">RENDER ENGINE: 4.2.0</span>
            <span className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">ALGERIA SERVER #01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualShow;
